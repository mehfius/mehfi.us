#!/bin/bash

# Cria uma nova sessão tmux chamada "mysession" com o primeiro comando
tmux new-session -d -s mysession 'http-server /home/mehfius/pessoal/supacall_dialog/ -p 3002'

# Cria um novo painel horizontal com o segundo comando
tmux split-window -h -t mysession 'http-server /home/mehfius/pessoal/ -p 3006'

# Se o script estiver rodando num terminal interativo, anexa à sessão
if [ -t 1 ]; then
  tmux attach-session -t mysession
else
  echo "Sessão 'mysession' criada. Use 'tmux attach -t mysession' para entrar."
fi
