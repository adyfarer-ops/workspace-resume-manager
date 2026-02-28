#!/usr/bin/env python3
"""
简历数据自动备份脚本
功能：备份JSON文件，保留最近30天备份，自动清理旧备份
"""

import os
import sys
import tarfile
import logging
from datetime import datetime, timedelta
from pathlib import Path

# ==================== 配置 ====================
SOURCE_DIR = "/root/.openclaw/workspace-resume-manager/data/"
BACKUP_DIR = os.path.join(SOURCE_DIR, "backups")
RETENTION_DAYS = 30  # 保留最近30天备份
LOG_FILE = os.path.join(BACKUP_DIR, "backup.log")

# ==================== 日志配置 ====================
def setup_logging():
    """配置日志输出"""
    os.makedirs(BACKUP_DIR, exist_ok=True)
    
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(LOG_FILE, encoding='utf-8'),
            logging.StreamHandler(sys.stdout)
        ]
    )
    return logging.getLogger(__name__)

logger = setup_logging()

# ==================== 核心功能 ====================
def get_json_files(directory):
    """获取目录下所有JSON文件"""
    json_files = []
    try:
        for file in os.listdir(directory):
            if file.endswith('.json') and os.path.isfile(os.path.join(directory, file)):
                json_files.append(os.path.join(directory, file))
    except Exception as e:
        logger.error(f"读取目录失败: {e}")
    return json_files

def create_backup():
    """创建备份文件"""
    # 生成备份文件名
    today = datetime.now().strftime('%Y%m%d')
    backup_filename = f"backup_{today}.tar.gz"
    backup_path = os.path.join(BACKUP_DIR, backup_filename)
    
    # 获取所有JSON文件
    json_files = get_json_files(SOURCE_DIR)
    
    if not json_files:
        logger.warning("未找到JSON文件，跳过备份")
        return None
    
    logger.info(f"找到 {len(json_files)} 个JSON文件")
    for f in json_files:
        logger.info(f"  - {os.path.basename(f)}")
    
    # 检查当天是否已备份
    if os.path.exists(backup_path):
        logger.warning(f"备份文件已存在: {backup_filename}")
        return backup_path
    
    # 创建tar.gz压缩包
    try:
        with tarfile.open(backup_path, "w:gz") as tar:
            for file_path in json_files:
                arcname = os.path.basename(file_path)
                tar.add(file_path, arcname=arcname)
                logger.info(f"已添加: {arcname}")
        
        # 获取文件大小
        file_size = os.path.getsize(backup_path)
        file_size_mb = file_size / (1024 * 1024)
        
        logger.info(f"✅ 备份成功: {backup_filename}")
        logger.info(f"   文件大小: {file_size_mb:.2f} MB")
        logger.info(f"   保存路径: {backup_path}")
        
        return backup_path
        
    except Exception as e:
        logger.error(f"❌ 备份失败: {e}")
        return None

def cleanup_old_backups():
    """清理超过保留期限的旧备份"""
    cutoff_date = datetime.now() - timedelta(days=RETENTION_DAYS)
    deleted_count = 0
    kept_count = 0
    
    try:
        for filename in os.listdir(BACKUP_DIR):
            if not filename.startswith('backup_') or not filename.endswith('.tar.gz'):
                continue
            
            file_path = os.path.join(BACKUP_DIR, filename)
            
            # 获取文件修改时间
            try:
                file_mtime = datetime.fromtimestamp(os.path.getmtime(file_path))
            except Exception:
                continue
            
            # 判断是否过期
            if file_mtime < cutoff_date:
                try:
                    os.remove(file_path)
                    logger.info(f"🗑️ 已删除旧备份: {filename}")
                    deleted_count += 1
                except Exception as e:
                    logger.error(f"删除失败 {filename}: {e}")
            else:
                kept_count += 1
                
    except Exception as e:
        logger.error(f"清理旧备份时出错: {e}")
    
    logger.info(f"清理完成: 删除 {deleted_count} 个, 保留 {kept_count} 个备份")
    return deleted_count, kept_count

def list_backups():
    """列出所有备份文件"""
    backups = []
    try:
        for filename in os.listdir(BACKUP_DIR):
            if filename.startswith('backup_') and filename.endswith('.tar.gz'):
                file_path = os.path.join(BACKUP_DIR, filename)
                try:
                    file_size = os.path.getsize(file_path)
                    file_mtime = datetime.fromtimestamp(os.path.getmtime(file_path))
                    backups.append({
                        'filename': filename,
                        'size': file_size,
                        'date': file_mtime
                    })
                except Exception:
                    pass
    except Exception as e:
        logger.error(f"列出备份时出错: {e}")
    
    # 按日期排序
    backups.sort(key=lambda x: x['date'], reverse=True)
    return backups

# ==================== 主程序 ====================
def main():
    """主函数"""
    logger.info("=" * 50)
    logger.info("📦 简历数据备份任务开始")
    logger.info("=" * 50)
    
    # 检查源目录
    if not os.path.exists(SOURCE_DIR):
        logger.error(f"❌ 源目录不存在: {SOURCE_DIR}")
        sys.exit(1)
    
    logger.info(f"📁 源目录: {SOURCE_DIR}")
    logger.info(f"📁 备份目录: {BACKUP_DIR}")
    logger.info(f"📅 保留期限: {RETENTION_DAYS} 天")
    
    # 创建备份
    backup_path = create_backup()
    
    # 清理旧备份
    deleted, kept = cleanup_old_backups()
    
    # 显示备份列表
    logger.info("-" * 50)
    logger.info("📋 当前备份列表:")
    backups = list_backups()
    for i, backup in enumerate(backups[:10], 1):  # 只显示最近10个
        size_mb = backup['size'] / (1024 * 1024)
        logger.info(f"   {i}. {backup['filename']} ({size_mb:.2f} MB) - {backup['date'].strftime('%Y-%m-%d %H:%M')}")
    
    if len(backups) > 10:
        logger.info(f"   ... 还有 {len(backups) - 10} 个备份")
    
    logger.info("-" * 50)
    logger.info("✅ 备份任务完成")
    logger.info("=" * 50)
    
    return backup_path is not None

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
