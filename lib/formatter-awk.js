var CompositeDisposable = require('atom').CompositeDisposable;
var FormatterAwk;

module.exports = FormatterAwk = {
	activate: function(state) { },
	config: {
		a: {
			title: 'Executable paths',
			type: 'object',
			properties: {
				gawkPath: {
					title: 'Full path of gawk executable',
					type: 'string',
					default: 'gawk'
				}
			}
		}
	},
	provideFormatter: function() {

		// newEdit(endIn, startIn, text)
		//		endIn:		{ line, col }	: First {Point} of segment
		//		startIn:	{ line, col }	: Last {Point} of segment
		//		text:		String/String[]	: Text to replace segment with
		//
		// returns a populated {CodeEdit} object
		function newEdit(endIn, startIn, text) {
			const entry = {
				end: {
					line: endIn.row,
					col: endIn.column
				},
				start: {
					line: startIn.row,
					col: startIn.column
				},
				newText: text.join('\n')
			};
			return entry;
		}

		function doError(err) {
			return atom.notifications.addError('formatter-awk : error', {
				dismissable: true,
				detail: err.join('\n')
			});
		}

		return {
			selector: '.source.awk',
			getCodeEdits: function(options) {
				const ChildProcess = require('child_process');
				return new Promise(function(resolve, reject) {
					const command = atom.config.get('formatter-awk.a.gawkPath');
					var editList = [];

					if (!options.selection) {
						// Formatter was called with nothing selected, so we act on the entire buffer
						var process, args;
						var fmt = [];
						var err = [];

						args = [];
						args.push('-f');
						args.push(options.editor.getPath());
						args.push('--pretty-print=-');
						console.log(command + ' ' + args.join(' '));
						process = ChildProcess.spawn(command, args, {});

						process.stderr.on('data', function(data) {
							return err.push(data);
						});

						process.stdout.on('data', function(data) {
							return fmt.push(data);
						});

						process.on('close', function() {
							if (fmt.length !== 0) {
								// Force a single selection of the entire buffer to act on whole file
								options.editor.selectAll();
								// Read selection object and reduce it into just it's range component
								var range = options.editor.getLastSelection().getBufferRange();
								editList.push(newEdit(range.end, range.start, fmt));
								return resolve(editList);
							} else {
								doError(err);	// Formatter returned null, so error out
							}
						});



					} else {
						var range = options.editor.getLastSelection().getBufferRange();
						var process, args;
						var fmt = [];
						var err = [];

						args = [];
						args.push('--pretty-print=-');
						args.push('--');
						args.push(options.editor.getSelectedText());
						console.log(command + ' ' + args.join(' '));
						process = ChildProcess.spawn(command, args, {});

						process.stderr.on('data', function(data) {
							return err.push(data);
						});

						process.stdout.on('data', function(data) {
							return fmt.push(data);
						});

						process.on('close', function() {
							if (fmt.length !== 0) {
								editList.push(newEdit(range.end, range.start, fmt));
								return resolve(editList);
							} else {
								doError(err);	// Formatter returned null, so error out
							}
						});
					}
				});
			}
		};
	}
};
