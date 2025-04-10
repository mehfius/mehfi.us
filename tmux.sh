#!/bin/bash

SESSION_NAME="mysession"

# Verifica se a sessão já existe
tmux has-session -t "$SESSION_NAME" 2>/dev/null

if [ $? != 0 ]; then
  # Cria nova sessão em background com o primeiro comando
  tmux new-session -d -s "$SESSION_NAME" 'http-server /home/mehfius/pessoal/supacall_dialog/ -p 3002'
  
  # Cria o segundo painel
  tmux split-window -h -t "$SESSION_NAME" 'http-server /home/mehfius/pessoal/ -p 3006'
else
  echo "Sessão '$SESSION_NAME' já existe."
fi

# Se terminal interativo, anexa
if [ -t 1 ]; then
  tmux attach-session -t "$SESSION_NAME"
else
  echo "Sessão '$SESSION_NAME' pronta. Use: tmux attach -t $SESSION_NAME"
fi
