class SqlInsertBatch {
    constructor(table) {
        this.table = table
        this.data=[]
    }

    add(dataObj) {
        if (typeof dataObj=='object') this.data.push(dataObj)
        else throw new Error('SqlInsertBatch.add requires an object')
    }

    length() {
        return Object.keys(this.data).length
    }

    flush() {
        console.log(chalk.green(`flushing ${this.data.length} data`))
        this.data=[]
    }

    getQuery() {
        if (this.data.length===0) return false
        var keys = Object.keys(this.data[0])
        var q = `INSERT INTO ${this.table} (${keys.join(',')}) VALUES `;
        var vals = []
        for(var i in this.data) {
            var line = this.data[i]
            if (this.table==='stats_ips') totalinserts1++; else totalinserts2++
            vals.push(`(${Object.values(line).join(',')})`)
        }
        return q+" "+vals.join(',')
    }

    doQuery(mysqlConnection,flush=true) {
        return new Promise((resolve,reject)=>{
            var query = this.getQuery()
            if (!query) resolve(true)
            // console.log(`query:`,query)
            mysqlConnection.query(query,(err,res,fields)=>{                
                if (err) return reject(err)
                resolve(res)
                if (flush) this.flush()
            })
        })
        
    }
}
