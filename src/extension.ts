'use strict';
import * as vscode from 'vscode';
import * as mkdirp from 'mkdirp';
import * as pify from 'pify';
import * as fs from 'fs';

const mkdirpp = pify(mkdirp);
const statp = pify(fs.stat);

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'extension.quickMemo',
    async () => {
      // Set HomeDirectory
      const homeDir = process.env.HOME;
      const rootDir = `${homeDir}/my-test-directory`;
      // make today's directory if needed
      const now = Date.now();
      const date = new Date(now);
      const m = date.getMonth() + 1;
      const d = date.getDate();
      const monthString = m < 10 ? `0${m}` : m;
      const dateString = d < 10 ? `0${d}` : d;

      const dirName = `${rootDir}/${date.getFullYear()}${monthString}${dateString}`;
      await mkdirpp(dirName);
      let input = await vscode.window.showInputBox({
        prompt: 'Input filename'
      });
      // Default file name
      if (input === undefined || input === '') {
        input = `${monthString}${dateString}_${date.getHours()}${date.getMinutes()}${date.getSeconds()}.md`;
      }
      // Set file type as markdown
      if (!input.match(/.md$/)) {
        input = `${input}.md`;
      }

      const filename = input;
      const path = `${dirName}/${filename}`;
      const uri = vscode.Uri.parse(`untitled:${path}`);

      // Check file
      let isExist: boolean = true;
      await statp(path).catch(() => {
        isExist = false;
      });

      let doc;
      try {
        if (!isExist) {
          // await vscode.workspace.openTextDocument(uri);
          vscode.window.showInformationMessage(`New file created! : ${path}`);
        }
        doc = await vscode.workspace.openTextDocument(uri);
      } catch (err) {
        vscode.window.showErrorMessage(err);
      }
      if (!doc) {
        return;
      }
      vscode.window.showTextDocument(doc, 1, false);
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
