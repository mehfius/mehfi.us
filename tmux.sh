#!/bin/bash

# Inicia uma nova sessão tmux chamada "mysession" com o primeiro comando
tmux new-session -d -s mysession 'http-server /home/mehfius/pessoal/supacall_dialog/ -p 3002'

# Abre um novo painel horizontal na mesma sessão com o segundo comando
tmux split-window -h 'http-server /home/mehfius/pessoal/ -p 3006'

# Anexa à sessão "mysession"
tmux attach-session -t mysession