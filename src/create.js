#!/usr/bin/env node

const prompt = require('prompt');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs');
const inquirer = require('inquirer');
const shell = require('shelljs');
const symbols = require('log-symbols');
const download = require('download-git-repo');
const handlebars = require('handlebars');

prompt.start();

prompt.get({
  properties: {
    name: {
      description: chalk.yellow('请输入目录名称'),
      message: chalk.red('必须输入目录名称'),
      required: true
    },
    template: {
      description: chalk.yellow('请选择项目模版 js/typescript'),
      required: false
    }
  }
}, (err, result) => {

  console.log('result-->', result)
  if (err) {
    process.exit()
  }
  let name= result.name

  if (!fs.existsSync(name)) {
    console.log('正在创建项目...');
    inquirer.prompt([{
        name: 'description',
        message: '请输入项目描述'
      },
      {
        name: 'author',
        message: '请输入作者名称'
      }
    ]).then(answers => {
      const spinner = ora('正在向下载模板...\n');
      spinner.start();
      let url= 'https://github.com/Lerbron/react-cli-tmp.git'
      if(result?.template && result?.template == 'typescript') {
        url= 'https://github.com/Lerbron/react-cli-tmp-ts.git'
      }
      download(`direct:${url}`, name, {
        clone: true
      }, err => {
        if (err) {
          spinner.fail();
          console.log(symbols.error, chalk.red('模板下载失败'))
        } else {
          spinner.succeed();
          const filename = `${name}/package.json`;
          const meta = {
            name,
            description: answers.description,
            author: answers.author
          }

          if (fs.existsSync(filename)) {
            const content = fs.readFileSync(filename).toString();
            let dt = JSON.parse(content);
            dt.name = '{{name}}';
            dt.description = '{{description}}'
            const result = handlebars.compile(JSON.stringify(dt, null, 2))(meta);
            fs.writeFileSync(filename, result);
            shell.cd(name);
            shell.rm('-rf', '.git');
            console.log(symbols.success, chalk.green('项目初始化完成'));
          } else {
            console.log(symbols.error, chalk.red('package不存在'))
          }
          process.exit()
        }
      })
    })
  } else {
    console.log(symbols.error, chalk.red('项目已存在'));
  }
})