import potrace from "potrace"
import fs from "fs/promises"

const icon = process.argv[2]
const options = process.argv.slice(3)

const overwrite = options.includes("--overwrite") || options.includes("-o")

if (!overwrite) {
    const hasIcon = await fs.stat(`./icons/${icon}.svg`)
        .then(() => true)
        .catch(() => false)

    if (hasIcon) {
        log("Icon already exists")
        process.exit(0)
    }
}

const svg = await new Promise((resolve, reject) => {
    potrace.trace(`./icons/${icon}.png`, (err, svg) => {
        if (err) {
            reject(err)
            return
        }

        resolve(svg)
    })
})

await fs.writeFile(`./icons/${icon}.svg`, svg)