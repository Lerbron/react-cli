# react+redux项目开发工具

## 安装方法：

1. 安装nodejs 10.16.x或以上版本

2. 安装yarn
  npm install yarn -g

3. 安装react-cli

	~~~bash
	git clone git@github.com:Lerbron/react-cli.git

	cd react-cli

	yarn install

	yarn link (如果提示权限不足使用 sudo yarn link)
	~~~


## 命令使用

1. react-cli server, build, create。```react-cli```可以查看帮助

2. ```react-cli server```启动本地server。默认端口3000.可使用-p 8000进行端口修改

	~~~
	react-cli server -p 8000
	~~~

3. ```fe create```创建新项目。根据提示输入项目名称及项目生产环境url前缀

	~~~
	react-cli create
	prompt: 请输入目录名称:  react-cli-demo
	prompt: 选择项目模版:   js/typescpript(默认js)
	prompt: 请出入项目描述:  description....
	prompt: 作者信息: ...
	~~~


	***安装完毕后可使用```react-cli server```启动本地server了，***
