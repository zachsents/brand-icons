import fs from "fs/promises"
import path from "path"


const passedIcon = process.argv[2]

if (passedIcon)
    await cleanIcon(passedIcon)
else {
    const icons = await fs.readdir("./icons")

    for (const icon of icons)
        await cleanIcon(icon)
}


/**
 * @param {string} icon
 */
async function cleanIcon(icon) {
    if (!icon.endsWith(".svg"))
        icon = `${icon}.svg`

    const iconPath = path.join("./icons", icon)
    const content = await fs.readFile(iconPath, "utf-8")

    const hasViewbox = /(?<=<svg[^>]*\s)viewBox/.test(content)

    let newContent = content

    if (!hasViewbox) {
        const width = content.match(/(?<=<svg[^>]*\swidth=["'])[\d.]+/)?.[0]
        const height = content.match(/(?<=<svg[^>]*\sheight=["'])[\d.]+/)?.[0]

        if (!width || !height)
            return

        newContent = newContent.replace(/<svg/, `<svg viewBox="0 0 ${width} ${height}"`)
    }

    newContent = newContent
        .replace(/(?<=<svg[^>]*\s(?:width|height)=["'])[\w.]+/g, "100")

    await fs.writeFile(iconPath, newContent)

    console.log(`Cleaned ${icon}`)
}