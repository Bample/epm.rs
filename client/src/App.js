const { Command } = require('commander');
const cc = require('cli-color');
const cp = require('cli-progress');
const os = require('os');
const fs = require('fs')
const path = require('path')
const { fstat } = require('fs');
const { Console } = require('console');
const axios = require('axios');

const program = new Command();

const version = '1'
const versionCode = '1021'



console.log('')
console.log(cc.cyan(cc.bold('Edgeless Package Manager')))
console.log(cc.green(cc.italic('Version', versionCode, '-', 'Code By Oxygen')))
console.log('')
program.version(versionCode)

program
// .option('-i, --info', 'View More Info')
    .option('-cS, --checkServer', 'Check App Indexes Server')
    .option('-lp, --listPkg', 'List App Package Config')
    .option('-lsls, --ls-ls <dir>', 'debug')


// console.log(program)

if (fs.existsSync('./oxygenshixie.txt') == true) {
    console.log(cc.bold('给👴爬，Cno才是屑（半恼'))
    console.log('')
}


program
    .command('info')
    .description('View Info')
    .action(() => {
        console.log(cc.blackBright('------------------------------------------------'))
        console.log('')
        console.log(cc.blackBright(cc.italic('System Platform:', os.platform + '_' + os.release + '_' + os.arch)))
        console.log(cc.blackBright(cc.italic('Process PID:', process.pid)))
        console.log(cc.blackBright(cc.italic('System Hostname:', os.hostname)))
        console.log(cc.blackBright(cc.italic('Node Directory:', process.execPath)))
        console.log(cc.blackBright(cc.italic('Node Directory:', __dirname)))
        console.log(cc.blackBright(cc.italic('Command Args:', JSON.stringify(program.opts(), null, 4))))
        console.log('')
        console.log(cc.blackBright(cc.italic('Runtime Versions: ' + JSON.stringify(process.versions, null, 4))))
        console.log('')
        console.log(cc.green('Git Repo URL:', cc.underline('https://github.com/YinsTeam/epm.js/')))
        console.log(cc.green(cc.bold('A Unified Package Manager.')))
        console.log('')
    });

program
    .command('checkMirror [url]')
    .description('Check Mirror')
    .action((url) => {
        console.log(cc.blackBright('------------------------------------------------'))
        console.log('')
        console.log(cc.blackBright('Checking Mirror:', url + '\n'))
        axios.get('https://' + url + '/request').then((r) => {
            if (r.data.result[1].code == 200 || r.headers['x-powered-by'] == 'Express') {
                console.log(cc.green(cc.bold('Checked! App Indexes Mirror Available!')))
                console.log(cc.blackBright(cc.italic('statusCode: ' + r.data.result[1].code)))
                console.log('')
            } else {
                console.error(cc.red(cc.bold('Checked! App Indexes Mirror Not Available!')))
                console.log('')
            }
        }).catch((err) => {
            console.error(cc.red(cc.bold('Checked! App Indexes Mirror Not Available!')))
            console.log('')
            console.error(cc.red(cc.bold('Error:')))
            console.error(err.errno)
            console.error(err.code)
            console.error(err.hostname)
            console.error(err.config)
        })
    })
    /*
    program
        .command('info','View Info')
        .option
        .action( () => {
        console.log(cc.blackBright('------------------------------------------------'))
        console.log('')
        console.log(cc.blackBright(cc.italic('System Platform:', os.platform + '_' + os.release + '_' + os.arch)))
        console.log(cc.blackBright(cc.italic('Process PID:', process.pid)))
        console.log(cc.blackBright(cc.italic('System Hostname:', os.hostname)))
        console.log(cc.blackBright(cc.italic('Node Directory:', process.execPath)))
        console.log(cc.blackBright(cc.italic('Node Directory:', __dirname)))
        console.log(cc.blackBright(cc.italic('Command Args:', JSON.stringify(program.opts(), null, 4))))
        console.log('')
        console.log(cc.blackBright(cc.italic('Runtime Versions: ' + JSON.stringify(process.versions, null, 4))))
        console.log('')
        console.log(cc.green('Git Repo URL:', cc.underline('https://github.com/im-oxygen/epm.js/')))
        console.log(cc.green(cc.bold('A Unified Package Manager.')))
        console.log('')
    })
    */
if (program.checkServer) {

}
if (program.listPkg) {
    let epmj_pre = fs.readFileSync(path.normalize(program.listPkg))
    let epmj = JSON.parse(epmj_pre.toString())
    console.log(cc.blackBright('------------------------------------------------'))
    console.log('')
    console.log(cc.greenBright('包 ' + cc.italic(epmj.packageConfig.name) + ' 信息:'))
    console.log('')
    console.log(cc.greenBright('所需 EPM 版本:'), epmj.use.usePackageConfig['epm.ForVersion'])
    console.log(cc.greenBright('适用平台:'), epmj.use.usePackageConfig['epm.ForPlatform'])
    console.log('')
    console.log(cc.greenBright('适用于系统发行版:'))
    console.log(cc.green('    Win32:'))
    console.log(cc.green('        Release ID:'), epmj.use.usePackageConfig['epm.ForSystemRelease'].win32.id)
    console.log(cc.green('        适用架构:'), epmj.use.usePackageConfig['epm.ForSystemRelease'].win32.forArch)
    console.log(cc.green('        是否向前兼容:'), epmj.use.usePackageConfig['epm.ForSystemRelease'].win32.forwardCompatible)
    console.log('')
    console.log(cc.green('    Linux:'))
    console.log(cc.green('        Release ID:'), epmj.use.usePackageConfig['epm.ForSystemRelease'].linux.id)
    console.log(cc.green('        适用架构:'), epmj.use.usePackageConfig['epm.ForSystemRelease'].linux.forArch)
    console.log(cc.green('        是否向前兼容:'), epmj.use.usePackageConfig['epm.ForSystemRelease'].linux.forwardCompatible)
    console.log('')
    console.log(cc.green('    Darwin'))
    console.log(cc.green('        Release ID:'), epmj.use.usePackageConfig['epm.ForSystemRelease'].darwin.id)
    console.log(cc.green('        适用架构:'), epmj.use.usePackageConfig['epm.ForSystemRelease'].darwin.forArch)
    console.log(cc.green('        是否向前兼容:'), epmj.use.usePackageConfig['epm.ForSystemRelease'].darwin.forwardCompatible)
    console.log('')
    console.log(cc.greenBright('是否兼容 Edgeless Plug-in Loader / EPT:'), epmj.use.usePackageConfig['epm.EdgelessCompatible'])
    console.log(cc.green('    EPT 配置:', ))
    console.log(cc.green('       包名称:'), epmj.use.useEdgelessCompatibleConfig['edgeless.extension.Name'])
    console.log(cc.green('       包版本:'), epmj.use.useEdgelessCompatibleConfig['edgeless.extension.Version'])
    console.log(cc.green('       包作者:'), epmj.use.useEdgelessCompatibleConfig['edgeless.extension.Author'])
    console.log(cc.green('       包简介:'), epmj.use.useEdgelessCompatibleConfig['edgeless.extension.Intro'])
    console.log(cc.green('       FullName:'), epmj.use.useEdgelessCompatibleConfig['edgeless.extension.Name'] + '_' + epmj.use.useEdgelessCompatibleConfig['edgeless.extension.Version'] + '_' + epmj.use.useEdgelessCompatibleConfig['edgeless.extension.Author'])
    console.log('')
    console.log(cc.greenBright('EPM 包设置:'))
    console.log(cc.green('   包名称:'), epmj.packageConfig.name)
    console.log(cc.green('   友好名称:'), epmj.packageConfig.friendlyName)
    console.log(cc.green('   包描述:'), epmj.packageConfig.description)
    console.log('')
    console.log(cc.green('   包版本:'))
    console.log(cc.green('       版本号:'), epmj.packageConfig.version.version)
    console.log(cc.green('       版本码:'), epmj.packageConfig.version.versionCode)
    console.log('')
    console.log(cc.green('   开发依赖:'))
    console.log(cc.green('       列表:'))
    for (let i = 1; i < epmj.packageConfig.devDependencies.length; i++) {
        console.log(cc.green('       依赖包名:'), epmj.packageConfig.devDependencies[i].dependencyName)
        console.log(cc.green('       依赖版本:'), epmj.packageConfig.devDependencies[i].dependencyVersion)
        console.log('')
    }
    console.log(cc.green('       子选项:'))
    console.log(cc.green('           计数器:'), epmj.packageConfig.devDependencies[0].__Counter__)
    console.log(cc.green('           执行标志:'), epmj.packageConfig.devDependencies[0].__Flags__)
    console.log('')
    console.log(cc.green('   产品依赖:'))
    console.log(cc.green('       列表:'))
    for (let i = 1; i < epmj.packageConfig.productionDependencies.length; i++) {
        console.log(cc.green('       依赖包名:'), epmj.packageConfig.productionDependencies[i].dependencyName)
        console.log(cc.green('       依赖版本:'), epmj.packageConfig.productionDependencies[i].dependencyVersion)
        console.log('')
    }
    console.log(cc.green('       子选项:'))
    console.log(cc.green('           计数器:'), epmj.packageConfig.productionDependencies[0].__Counter__)
    console.log(cc.green('           执行标志:'), epmj.packageConfig.productionDependencies[0].__Flags__)
}
if (program.lsLs) {
    console.log(program.lsLs)

}

program.parse(program.argv)