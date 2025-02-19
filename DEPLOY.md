# 部署指南

## 环境要求

- Node.js 18.x 或更高版本
- Nginx 1.20.x 或更高版本
- PM2 (用于进程管理)

## 部署步骤

### 1. 准备工作

```bash
# 安装 PM2
npm install -g pm2

# 安装项目依赖
npm install

# 构建项目
npm run build
```

### 2. 配置 Nginx

1. 将 `nginx.conf` 文件复制到 Nginx 配置目录：
```bash
sudo cp nginx.conf /etc/nginx/nginx.conf
```

2. 修改配置文件中的以下内容：
- 将 `server_name` 替换为你的域名
- 将静态文件路径 `/path/to/your/.next/static` 替换为实际的 `.next/static` 目录路径
- 将公共文件路径 `/path/to/your/public` 替换为实际的 `public` 目录路径

3. 检查 Nginx 配置是否正确：
```bash
sudo nginx -t
```

4. 重启 Nginx：
```bash
sudo systemctl restart nginx
```

### 3. 启动应用

1. 使用 PM2 启动应用：
```bash
pm2 start npm --name "qitp" -- start
```

2. 设置开机自启：
```bash
pm2 startup
pm2 save
```

### 4. 验证部署

访问你的域名，确保：
- 网站可以正常访问
- 静态资源加载正常
- API 接口可以正常调用
- 页面刷新不会出现 404 错误

### 5. 监控和日志

- 查看应用状态：`pm2 status`
- 查看应用日志：`pm2 logs qitp`
- 查看 Nginx 访问日志：`tail -f /var/log/nginx/access.log`
- 查看 Nginx 错误日志：`tail -f /var/log/nginx/error.log`

### 6. 更新部署

当需要更新应用时：

```bash
# 拉取最新代码
git pull

# 安装依赖
npm install

# 构建项目
npm run build

# 重启应用
pm2 restart qitp
```

## 注意事项

1. 确保服务器防火墙允许 80 端口（HTTP）和 443 端口（HTTPS）的访问
2. 建议配置 HTTPS，可以使用 Let's Encrypt 免费证书
3. 定期备份数据和配置文件
4. 监控服务器资源使用情况
5. 设置日志轮转，避免日志文件过大

## 故障排除

1. 如果出现 502 错误：
   - 检查 Node.js 应用是否正在运行
   - 检查 Nginx 配置中的代理地址是否正确
   - 查看 Nginx 错误日志

2. 如果静态资源加载失败：
   - 检查 Nginx 配置中的静态文件路径是否正确
   - 确保文件权限正确

3. 如果 API 请求失败：
   - 检查网络连接
   - 查看应用日志
   - 确认 API 路由配置正确

## 性能优化建议

1. 启用 Nginx 缓存
2. 配置合适的 PM2 实例数量
3. 使用 CDN 加速静态资源
4. 开启 Gzip 压缩
5. 优化数据库查询
6. 实现合理的缓存策略 