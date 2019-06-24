guidion
=======


[![CircleCI](https://circleci.com/gh/dieffrei/fflib-sfdx-plugin.svg?style=svg)](https://circleci.com/gh/dieffrei/fflib-sfdx-plugin)
<!-- toc -->
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g fflib
$ fflib COMMAND
running command...
$ fflib (-v|--version|version)
fflib/0.0.0 darwin-x64 node-v10.15.3
$ fflib --help [COMMAND]
USAGE
  $ fflib COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`fflib fflib:source:selector [SOBJECTNAME]`](#fflib-fflibsourceselector-sobjectname)

## `fflib fflib:source:selector [SOBJECTNAME]`

FFLIB SFDX pluginn

```
USAGE
  $ fflib fflib:source:selector [SOBJECTNAME]

OPTIONS
  -o, --outputpath=outputpath                      (required) Output path
  -u, --targetusername=targetusername              username or alias for the target org; overrides default target org
  -v, --targetdevhubusername=targetdevhubusername  username or alias for the dev hub org; overrides default dev hub org
  --apiversion=apiversion                          override the api version used for api requests made by this command
  --json                                           format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)   logging level for this command invocation

EXAMPLE
  $ sfdx fflib:source:selector
```

_See code: [src/commands/fflib/source/selector.ts](https://github.com/dieffrei/fflib-sfdx-plugin/blob/v0.0.0/src/commands/fflib/source/selector.ts)_
<!-- commandsstop -->
<!-- debugging-your-plugin -->
# Debugging your plugin
We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `hello:org` command: 
1. Start the inspector
  
If you linked your plugin to the sfdx cli, call your command with the `dev-suspend` switch: 
```sh-session
$ sfdx hello:org -u myOrg@example.com --dev-suspend
```
  
Alternatively, to call your command using the `bin/run` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:
```sh-session
$ NODE_OPTIONS=--inspect-brk bin/run hello:org -u myOrg@example.com
```

2. Set some breakpoints in your command code
3. Click on the Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach to Remote" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach to Remote" launch configuration window. The debugger should now be suspended on the first line of the program. 
6. Hit the green play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
<br><img src=".images/vscodeScreenshot.png" width="480" height="278"><br>
Congrats, you are debugging!
