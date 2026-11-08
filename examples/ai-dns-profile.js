// Clash Verge Rev per-profile script example; no node credentials included.
// Merge this logic into an existing main() instead of replacing its other work.
function main(config) {
  const aiGroup = "AI-人工智能"; // Change to an existing group in this profile.
  if (!(config["proxy-groups"] || []).some(group => group.name === aiGroup)) {
    throw new Error("AI proxy group is missing; review the profile before applying");
  }
  const dns = config.dns;
  if (!dns || dns.enable !== true || !dns["proxy-server-nameserver"] ||
      dns["proxy-server-nameserver"].length === 0) {
    throw new Error("Enable DNS and configure independent proxy-server-nameserver first");
  }
  const policies = dns["nameserver-policy"] || (dns["nameserver-policy"] = {});
  const resolvers = [
    "https://1.1.1.1/dns-query#" + aiGroup,
    "https://8.8.8.8/dns-query#" + aiGroup
  ];
  const domains = [
    "anthropic.com", "chatgpt.com", "chatgpt.livekit.cloud",
    "claude.ai", "claude.com", "claudeusercontent.com",
    "claudemcpclient.com", "claudemcpcontent.com",
    "oaistatic.com", "oaistatsig.com", "oaiusercontent.com", "openai.com"
  ];
  for (const domain of domains) policies["+." + domain] = resolvers.slice();
  const providers = config["rule-providers"] || {};
  for (const name of ["OpenAI", "Claude"]) {
    if (Object.prototype.hasOwnProperty.call(providers, name)) {
      policies["rule-set:" + name] = resolvers.slice();
    }
  }
  // Preserve IPv6, other DNS policies, nodes, groups and routing rules.
  return config;
}
