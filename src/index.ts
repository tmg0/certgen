import { CronJob } from 'cron'
import { loadConfig } from 'c12'
import zerossl from './zerossl'

const run = <T extends (config: CertgenConfig) => void>(cmd: T) => () => {
  loadConfig<CertgenConfig>({ name: 'certgen' }).then(({ config }) => { if (config) cmd(config) })
}

new CronJob('* * * * * *', run(zerossl))
