#!/bin/bash
# Script para configurar pnpm en la sesión actual
export PNPM_HOME="$HOME/Library/pnpm"
export PATH="$PNPM_HOME:$PATH"
echo "pnpm configurado. Versión: $(pnpm --version)"

