
import Service from '../lib/Service'

const service = new Service(process.cwd())
const argv = process.argv;
const name = argv[2]
service.run(name)