# Static IP Playbook

## 给 Agent 的提示词

把下面这段话直接发给你的 Agent：

```text
请安装并使用 static-ip-playbook 这个 skill：从 https://github.com/mxgarage/static-ip-playbook 把仓库克隆到本地，装进你的 skills 目录，然后按 SKILL.md 的流程帮我操作。先装前置 VPS；前置代理够用就停在这里，不要默认订阅静态 IP；只有模型订阅、海外社媒运营等需要住宅静态出口的特殊场景，才继续部署静态 IP。所有采购都从 skill 里给的链接开始，付款、登录、验证码这些步骤由我本人完成。
```

一套可复用的静态住宅 IP 操作手册：前置 VPS 安装、采购、验价、接线、健康检查、续命、排障。

## 里面有什么

- `SKILL.md`：完整方法。先装前置 VPS，再定需求（国家、城市、静态、独享、住宅/ISP 五项），再比价、下单核验、三种接法（直连、分流、经 VPS 链式转发）、上线前健康检查、到期续命、常见排障。
- `skill.yaml`：skill 描述文件。
- `前置VPS与静态IP指南.md`：前置 VPS 采购、订阅、终端配置与模型订阅环境检查的完整指南。
- [Clash Verge Rev macOS 配置指南](clash-verge-rev-macos.md)：Apple 芯片 / Intel 芯片安装包选择、手动填写远程订阅、本地 YAML 导入、跨电脑配置对齐，以及旧客户端 YAML 解析报错排查。
- [网络健康检查与 AI 固定出口](network-health-check.md)：区分配置与实际流量、TUN 路由冲突、企业网络共存、DNS / IPv6 / WebRTC 检查，以及 HTTP 状态和 IP 评分的判断边界。
- [AI DNS 增强脚本示例](examples/ai-dns-profile.js)：按当前订阅追加 AI DNS 策略，保留其他域名与 IPv6 设置；使用前按检查指南核对前提。可用 `node --test tests/ai-dns-profile.test.cjs` 验证示例行为。

已有 VPS、只想配置另一台 Mac：直接打开这份 [macOS 指南](clash-verge-rev-macos.md)。两类芯片使用相同订阅，区别在安装包；同一订阅不会自动同步原机的本地覆写规则和代理开关。

已有配置、想检查 GPT / Claude 网络：直接使用 [健康检查指南](network-health-check.md)。VPS 被识别为机房 IP 不自动等于“不健康”，住宅 IP 也不保证账号资格；先验证实际应用的出口，再决定是否需要调整。

## 使用场景

- 海外 AI 模型与 SaaS 订阅：部分海外服务仅面向特定地区开放注册与付费，静态住宅 IP 提供稳定的地区一致出口
- 海外社媒账号运营：用固定出口管理海外市场账号，保持登录环境稳定
- 跨境电商与独立站运营：管理海外店铺，查看当地市场的价格与页面展示
- 海外市场调研：查看不同地区的搜索结果、广告投放与竞品页面
- 产品多地区测试：验证网站与应用在不同地区的访问与展示效果

## 怎么用

按 `SKILL.md` 的顺序走。先装前置 VPS；不需要静态 IP 就停在这里，只有模型订阅、海外社媒运营等特殊场景才继续走静态 IP。关键纪律：先验出口再碰目标账号；先对结账总价再付款；到期前续命，优先延长原单保住同一个 IP。
