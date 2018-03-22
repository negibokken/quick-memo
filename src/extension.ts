import * as vscode from 'vscode';
import { QuickMemo } from './QuickMemo';

export function activate(context: vscode.ExtensionContext) {
  const quickMemo: QuickMemo = new QuickMemo();
  console.log('hello');

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.openQuickMemo', () => {
      quickMemo
        .openQuickMemo()
        .catch(err => vscode.window.showErrorMessage(err));
    }),
    vscode.commands.registerCommand('extension.quickMemo', () => {
      quickMemo.quickMemo().catch(err => vscode.window.showErrorMessage(err));
    })
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
