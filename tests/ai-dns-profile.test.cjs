const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname, '../examples/ai-dns-profile.js'), 'utf8'), context);
const clone = value => JSON.parse(JSON.stringify(value));
const fixture = () => ({
  mode: 'rule', ipv6: true, tun: { enable: false },
  proxies: [{ name: 'test-node', type: 'direct' }],
  'proxy-groups': [{ name: 'AI-人工智能', type: 'select', proxies: ['test-node'] }],
  'rule-providers': { OpenAI: { type: 'inline', behavior: 'domain', payload: ['+.openai.com'] } },
  rules: ['RULE-SET,OpenAI,AI-人工智能', 'MATCH,DIRECT'],
  dns: {
    enable: true, ipv6: true, 'enhanced-mode': 'fake-ip',
    'proxy-server-nameserver': ['https://dns.example/dns-query'],
    nameserver: ['https://dns.example/dns-query'],
    'nameserver-policy': { '+.internal.example': ['10.0.0.53'], '+.chatgpt.com': ['1.1.1.1'] }
  }
});

test('AI DNS changes preserve unrelated configuration and existing private-domain policies', () => {
  const input = fixture();
  const before = clone(input);
  const result = clone(context.main(input));
  for (const key of Object.keys(before).filter(key => key !== 'dns')) {
    assert.deepEqual(result[key], before[key]);
  }
  for (const key of Object.keys(before.dns).filter(key => key !== 'nameserver-policy')) {
    assert.deepEqual(result.dns[key], before.dns[key]);
  }
  const policies = result.dns['nameserver-policy'];
  assert.deepEqual(policies['+.internal.example'], before.dns['nameserver-policy']['+.internal.example']);
  for (const key of ['+.chatgpt.com', '+.claude.ai', 'rule-set:OpenAI']) {
    assert.deepEqual(policies[key], [
      'https://1.1.1.1/dns-query#AI-人工智能', 'https://8.8.8.8/dns-query#AI-人工智能'
    ]);
  }
  assert.equal(Object.hasOwn(policies, 'rule-set:Claude'), false);
});

test('subscription reactivation is idempotent', () => {
  const result = context.main(fixture());
  const once = clone(result);
  assert.deepEqual(clone(context.main(result)), once);
});

test('missing AI group fails before any partial mutation', () => {
  const input = fixture();
  input['proxy-groups'] = [];
  const before = clone(input);
  assert.throws(() => context.main(input), /AI proxy group is missing/);
  assert.deepEqual(input, before);
});

test('disabled DNS or missing bootstrap fails without changing existing settings', () => {
  for (const change of [dns => { dns.enable = false; }, dns => { delete dns['proxy-server-nameserver']; }]) {
    const input = fixture();
    change(input.dns);
    const before = clone(input);
    assert.throws(() => context.main(input), /proxy-server-nameserver/);
    assert.deepEqual(input, before);
  }
});
