#!/bin/sh

host=$1
port=$2
shift 2
cmd="$@"

echo "Waiting for $host:$port..."

while ! nc -z "$host" "$port"; do
  sleep 1
done

echo "$host:$port is available. Running command: $cmd"

exec $cmd
