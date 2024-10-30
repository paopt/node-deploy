import * as path from 'node:path'
import pkg from '../../package.json'
import { compress } from '../utils/compress'
import { login } from '../utils/ssh'
import { uploadFiles } from '../utils/upload'
import * as log from '../utils/log'
import { DeployEnvConfig } from '../types'
import { unzip } from '../utils/remoteActions'

export async function deploy(config: DeployEnvConfig) {
  try {
    const filename = 'dist.zip'
    const localDir = path.resolve(process.cwd(), config.localDir)
    const zipFile = await compress(localDir, filename)
    const ssh = await login(config)
    await uploadFiles(ssh, zipFile, config.remoteDir, filename)
    await unzip(ssh, config.remoteDir, filename, pkg.version)

    console.log()
    console.log(log.success('恭喜你，部署成功了！😁😁😁😁😁😁'))
    console.log()
  } catch (err) {
    log.warn('部署失败')
    console.log(err)
    process.exit()
  } finally {
    process.exit()
  }
}
