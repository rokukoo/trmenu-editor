# GitHub Actions 工作流

本目录包含 TrMenu Editor 项目的 GitHub Actions 自动化工作流配置。

## 📁 文件说明

| 文件                    | 用途              | 状态        |
| ----------------------- | ----------------- | ----------- |
| `ci.yml`                | 完整的 CI/CD 流程 | ✅ 主要使用 |
| `deploy-simple.yml`     | 简化版部署        | ⚡ 快速上手 |
| `preview.yml`           | PR 预览部署       | 🔧 需配置   |
| `release.yml`           | 自动发布          | 📦 Tag 触发 |
| `dependency-review.yml` | 依赖安全审查      | 🔒 自动运行 |
| `codeql.yml`            | 代码安全扫描      | 🔍 定期运行 |

## 🚀 快速开始

### 1. 基础工作流（推荐新手）

`deploy-simple.yml` 是最简单的配置，开箱即用：

```yaml
✅ 代码检查
✅ 构建项目
❌ 不包含部署（需要手动配置）
```

### 2. 完整工作流（生产环境）

`ci.yml` 提供完整的 CI/CD 功能：

```yaml
✅ 代码检查（ESLint + TypeScript）
✅ 构建项目
✅ 部署到 Vercel（需配置）
✅ 部署到 GitHub Pages（需配置）
✅ 部署到服务器（需配置）
✅ Docker 镜像构建（需配置）
```

## 🔧 配置步骤

### 第一步：选择部署方式

根据你的需求选择以下之一：

#### 选项 A: Vercel（最简单）

1. 在 [Vercel](https://vercel.com) 创建账号
2. 导入你的 GitHub 仓库
3. 获取 Vercel Token：https://vercel.com/account/tokens
4. 添加到 GitHub Secrets：
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`（可选）
   - `VERCEL_PROJECT_ID`（可选）

#### 选项 B: GitHub Pages（免费）

1. 修改 `next.config.ts` 启用静态导出
2. 在仓库 Settings > Pages 启用 GitHub Actions
3. 编辑 `ci.yml`，将 `deploy-github-pages` 的 `if: false` 改为 `if: true`

#### 选项 C: 自有服务器（完全控制）

1. 生成 SSH 密钥对
2. 添加公钥到服务器
3. 添加到 GitHub Secrets：
   - `SSH_PRIVATE_KEY`
   - `SERVER_HOST`
   - `SERVER_USER`
   - `DEPLOY_PATH`

### 第二步：启用工作流

在 `ci.yml` 中找到对应的部署阶段，修改条件：

```yaml
# 将 if: false 改为 if: true
if: github.event_name == 'push' && github.ref == 'refs/heads/main' && true
```

### 第三步：推送代码触发

```bash
git add .
git commit -m "配置 GitHub Actions"
git push origin main
```

## 📊 查看运行状态

访问你的仓库 → **Actions** 标签页 → 选择工作流运行

## 💡 使用技巧

### 只在主分支部署

```yaml
if: github.ref == 'refs/heads/main'
```

### 手动触发部署

在 Actions 页面找到工作流 → 点击 "Run workflow"

### 跳过 CI

在提交信息中添加：

```bash
git commit -m "更新文档 [skip ci]"
```

## 🔐 必需的 Secrets

根据部署方式配置（在 Settings > Secrets and variables > Actions）：

### Vercel

```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

### 服务器

```
SSH_PRIVATE_KEY
SERVER_HOST
SERVER_USER
DEPLOY_PATH
```

### Docker

```
DOCKER_USERNAME
DOCKER_PASSWORD
```

## 📚 详细文档

查看 [docs/GITHUB_ACTIONS_SETUP.md](../docs/GITHUB_ACTIONS_SETUP.md) 获取完整配置指南。

## ❓ 常见问题

### Q: 工作流没有触发？

**A:** 检查以下几点：

1. Actions 是否在仓库中启用
2. 分支名是否匹配（main/master）
3. 工作流文件语法是否正确

### Q: 构建失败？

**A:** 查看失败的步骤日志，通常是：

- 依赖安装问题
- 代码检查不通过
- 环境变量未配置

### Q: 部署失败？

**A:** 确认：

- Secrets 是否正确配置
- 部署目标是否可访问
- 权限是否足够

## 🆘 获取帮助

- 📖 [GitHub Actions 文档](https://docs.github.com/en/actions)
- 📧 联系：hello@cloudstackz.com
- 🐛 [提交 Issue](../../issues)

---

**提示：** 从 `deploy-simple.yml` 开始，熟悉后再使用 `ci.yml` 的高级功能。
