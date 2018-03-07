'use strict';
import * as vscode from 'vscode';
import * as mkdirp from 'mkdirp';
import * as pify from 'pify';
import * as fs from 'fs';

const mkdirpp = pify(mkdirp);
const statp = pify(fs.stat);

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'extension.tempMemo',
    async () => {
      // Set HomeDirectory
      const homeDir = process.env.HOME;
      const rootDir = `${homeDir}/my-test-directory`;
      // make today's directory if needed
      const now = Date.now();
      const date = new Date(now);
      const dirName = `${rootDir}/${date.getFullYear()}${date.getMonth() +
        1}${date.getDate()}`;
      await mkdirpp(dirName);
      const filename = 'test-file.md';
      const path = `${dirName}/${filename}`;
      const uri = vscode.Uri.parse(`untitled:${path}`);

      let isExist: boolean = true;
      await statp(path).catch(() => {
        isExist = false;
      });
      const fileUri = vscode.Uri.file(path);
      try {
        if (!isExist) {
          await vscode.workspace.openTextDocument(uri);
          vscode.window.showInformationMessage(`New file created! : ${path}`);
        }
        await vscode.workspace.openTextDocument();
      } catch (err) {
        console.log(err);
        vscode.window.showErrorMessage(err);
      }

      let edit = new vscode.WorkspaceEdit();
      edit.insert(fileUri, new vscode.Position(1, 0), '\n');
      vscode.workspace.applyEdit(edit);
      // Save Text
      // TODO
      // Show the document
      await vscode.window.showTextDocument(fileUri);
      // wait editing filename
      // if filename is empty then set the date string .md
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
