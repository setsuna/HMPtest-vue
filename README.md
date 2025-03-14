# 硬件综合平台 (Hardware Management Platform)

一个用于管理和控制各种硬件设备的 Web 应用程序，使用 Nuxt 3、Vue 3 构建。

## 功能

该平台提供以下功能：

- **指纹识别**：指纹采集与识别功能
- **身份证识别**：读取身份证信息与照片
- **高拍仪**：文档扫描与图像处理

## 技术栈

- **前端框架**：Nuxt 3 / Vue 3
- **CSS 框架**：Tailwind CSS
- **图标库**：Lucide Icons
- **TypeScript**：类型安全的代码

## 项目结构

```
HMP-nuxt/
├── app.vue                # 应用入口
├── assets/                # 静态资源
│   └── css/              
│       └── globals.css    # 全局样式
├── components/            # 可重用组件
│   └── PageNavigator.vue  # 页面导航组件
├── composables/           # 组合式函数
│   ├── useCameraService.ts       # 高拍仪服务
│   ├── useErrorHandler.ts        # 错误处理服务
│   ├── useFingerprintService.ts  # 指纹识别服务
│   └── useIdcardService.ts       # 身份证服务
├── layouts/               # 布局组件
│   └── default.vue        # 默认布局
├── pages/                 # 页面组件
│   ├── camera.vue         # 高拍仪页面
│   ├── fingerprint.vue    # 指纹识别页面
│   ├── idcard.vue         # 身份证页面
│   └── index.vue          # 首页
├── plugins/               # Nuxt 插件
│   └── lucide.ts          # Lucide 图标注册
├── public/                # 公共资源
│   └── images/            # 图片资源
├── utils/                 # 工具函数
│   ├── formatters.ts      # 格式化工具
│   └── validators.ts      # 验证工具
├── nuxt.config.ts         # Nuxt 配置
├── tailwind.config.js     # Tailwind 配置
├── tsconfig.json          # TypeScript 配置
└── package.json           # 依赖和脚本
```

## 安装和使用

### 安装依赖

```bash
npm install
```

### 开发环境

```bash
npm run dev
```

### 生产构建

```bash
npm run build
npm run start
```

## 设备服务接口

该应用需要以下设备服务支持：

- 指纹服务: http://127.0.0.1:8867/
- 身份证服务: http://127.0.0.1:8000/cgi-bin/
- 高拍仪服务: http://127.0.0.1:6543/
