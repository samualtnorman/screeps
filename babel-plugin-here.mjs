import { relative as relativeFilePath } from "path"

export default ({ types: t }) => {
	return ({
		name: "test",
		visitor: {
			Program(path) {
				if (path.scope.hasGlobal("HERE")) {
					const [variableDeclarationPath] = path.unshiftContainer(
						"body",
						t.variableDeclaration(
							"let",
							[t.variableDeclarator(t.identifier("HERE"))]
						)
					)

					path.scope.crawl()

					for (const referencePath of path.scope.getBinding("HERE").referencePaths) {
						referencePath.replaceWith(t.stringLiteral(`${relativeFilePath(".", this.file.opts.filename)}:${referencePath.node.loc.start.line}:${referencePath.node.loc.start.column + 1}`))
					}

					variableDeclarationPath.remove()
				}
			}
		}
	})
}
