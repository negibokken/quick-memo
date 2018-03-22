import * as vscode from 'vscode';
import { QuickMemo } from './QuickMemo';

export function activate(context: vscode.ExtensionContext) {
  const quickMemo: QuickMemo = new QuickMemo();
  let disposable = vscode.commands.registerCommand(
    'extension.quickMemo',
    quickMemo.quickMemo
  );
  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
