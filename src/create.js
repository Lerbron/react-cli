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
      description: chalk.yellow('Please input project name'),
      message: chalk.red('project name required'),
      required: true
    },
    template: {
      description: chalk.yellow('please input project template js or typescript'),
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
    console.log('creating...');
    inquirer.prompt([{
        name: 'description',
        message: 'please input project description'
      },
      {
        name: 'author',
        message: 'please input author'
      }
    ]).then(answers => {
      const spinner = ora('loading...\n');
      spinner.start();
      let url= 'https://github.com/Lerbron/react-cli-tmp.git'
      if(result.template && result.template == 'typescript') {
        url= 'https://github.com/Lerbron/react-cli-tmp-ts.git'
      }
      download(`direct:${url}`, name, {
        clone: true
      }, err => {
        if (err) {
          spinner.fail();
          console.log(symbols.error, chalk.red('load template fail'))
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
            console.log(symbols.success, chalk.green('init finished'));
          } else {
            console.log(symbols.error, chalk.red('package is not exist'))
          }
          process.exit()
        }
      })
    })
  } else {
    console.log(symbols.error, chalk.red('project is exist'));
  }
})