# Instructions
## Enable Docker API
1. Edit file `/lib/systemd/system/docker.service` as root
2. Find the line which starts with ExecStart and add `-H=tcp://0.0.0.0:2375 --api-cors-header=*` at the end of the line
3. Save the file
4. Reload the docker daemon: `systemctl daemon-reload`
5. Restart the container: `sudo service docker restart`

## Set environment variables
- NEXT_PUBLIC_APIURL=http://localhost:2375
- NEXT_PUBLIC_APIVERSION=v1.41

## Run
You can run the development server with

```bash
npm run dev
```
