import { test } from "@jest/globals";
import { render, act } from "@testing-library/react";

import Home from "pages/index";

jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: "",
      asPath: "/",
    };
  },
}));

test("renders correctly", async () => {
  fetch.mockResponse(
    JSON.stringify([
      {
        Id: "d140a2c8cf15efd5d3042e20994da400f2aaf88cb56ae50191ea0238cb5edecc",
        Names: ["/doqu_docker_worker-beat_1"],
        Image: "doqu_docker_worker-beat",
        ImageID:
          "sha256:af0d5fe63992b00137ebcf7f085364bed8e64da6ff3e4c8e4cff391613bc3c6a",
        Command:
          "sh -c 'cd /doqu/doqu && \n       celery -A doqu.modules.api beat -l WARNING --pidfile /doqu/celery-beat.pid -s /doqu/celerybeat-schedule'",
        Created: 1629539242,
        Ports: [],
        Labels: {
          "com.docker.compose.config-hash":
            "c5b35cdc0c25ca450098326e1220efb9bffc64036681380aae60d45808dce339",
          "com.docker.compose.container-number": "1",
          "com.docker.compose.oneoff": "False",
          "com.docker.compose.project": "doqu_docker",
          "com.docker.compose.project.config_files": "docker-compose.yml",
          "com.docker.compose.project.working_dir":
            "/home/erika/Lavori/Pragma2000/doqu_docker",
          "com.docker.compose.service": "worker-beat",
          "com.docker.compose.version": "1.28.2",
        },
        State: "running",
        Status: "Up 26 minutes",
        HostConfig: {
          NetworkMode: "doqu_docker_default",
        },
        NetworkSettings: {
          Networks: {
            doqu_docker_default: {
              IPAMConfig: null,
              Links: null,
              Aliases: null,
              NetworkID:
                "dbaaa2abda13c2f05e253fc2297285b5b8ec5a0ad373df9a7bf844da8dd083e7",
              EndpointID:
                "f246dcbe602f5a199f2c17ccc99bc52f347e20a445e8feedb67fb0adff2050a2",
              Gateway: "172.18.0.1",
              IPAddress: "172.18.0.12",
              IPPrefixLen: 16,
              IPv6Gateway: "",
              GlobalIPv6Address: "",
              GlobalIPv6PrefixLen: 0,
              MacAddress: "02:42:ac:12:00:0c",
              DriverOpts: null,
            },
          },
        },
        Mounts: [
          {
            Type: "bind",
            Source: "/mnt/safe",
            Destination: "/doqu/media",
            Mode: "rw",
            RW: true,
            Propagation: "rprivate",
          },
        ],
      },
    ])
  );

  await act(async () => render(<Home />));
});
