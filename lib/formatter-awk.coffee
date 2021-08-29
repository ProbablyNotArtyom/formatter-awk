{CompositeDisposable} = require 'atom'

module.exports = FormatterAwk =
	activate: (state) ->
		return

	config:
		a:
			title: 'Executable paths'
			type: 'object'
			properties:
				gawkPath:
					title: 'Full path of gawk executable'
					type: 'string'
					default: 'gawk'

	provideFormatter: ->
		{
			selector: '.source.awk'
			getNewText: (text) ->
				child_process = require 'child_process'
				return new Promise (resolve, reject) ->
					command = atom.config.get 'formatter-awk.a.gawkPath'
					args = []
					args.push '-o-'
					console.log args
					toReturn = []
					toReturnErr = []
					process = child_process.spawn(command, args, {})
					process.stderr.on 'data', (data) -> toReturnErr.push data
					process.stdout.on 'data', (data) -> toReturn.push data
					process.stdin.write text
					process.stdin.end()
					process.on 'close', ->
						if toReturn.length isnt 0
							resolve(toReturn.join('\n'))
						else
							atom.notifications.addError('formatter-awk : error',
							{
								dismissable: true, detail: toReturnErr.join('\n')
							})
		}
