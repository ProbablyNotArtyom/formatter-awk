# formatter-awk package

[Formatter](https://atom.io/packages/formatter)
plugin that uses the GNU [gawk](https://www.gnu.org/software/gawk/)
utility to format `awk` sources

## Installation

1.  Install gawk (`pacman -S gawk`)

2.  Install the [formatter](https://atom.io/packages/formatter) base package from within Atom (*or with* `apm install formatter`)

3.  Install this package from within Atom (*or with* `apm install formatter-awk`)

## Usage

From within any `.awk` source, do one of the following

 - Use the default keybindings provided by [Formatter](https://atom.io/packages/formatter) (or as defined in your `keymap.cson`)
```coffee
'atom-text-editor':
		'alt-ctrl-l': 'formatter:format-code'
		'alt-cmd-l': 'formatter:format-code'
```
 - Run `formatter:format-code` from the command palette

## Contributing

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Commit your changes: `git commit -am 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request :D

## License

See [LICENSE.md](./LICENSE.md)
