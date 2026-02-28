# 部署配置

## 部署目录
- 生产环境: `/var/www/ady/`
- 访问地址: `https://yfarer.cn/ady/`

## 部署命令
```bash
npm run build
cp -r dist/* /var/www/ady/
```

## Nginx 配置
配置文件: `/etc/nginx/conf.d/yfarer.cn.conf`

已配置路径:
- `/ady/` -> `/var/www/ady/`
