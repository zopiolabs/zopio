"""
SPDX-License-Identifier: MIT
"""

import asyncio
import os
from typing import Any, Dict

import parlant.sdk as p


def _get_nlp_service():
  name = os.getenv("PARLANT_NLP_SERVICE")
  if not name:
    return None

  service_map = {
    "openai": p.NLPServices.openai,
    "ollama": p.NLPServices.ollama,
    "vertex": p.NLPServices.vertex,
    "snowflake": p.NLPServices.snowflake,
  }

  return service_map.get(name.lower())


async def _run_server() -> None:
  port = int(os.getenv("PARLANT_SERVER_PORT", "8800"))
  tool_service_port = int(os.getenv("PARLANT_TOOL_SERVICE_PORT", "8818"))

  server_kwargs: Dict[str, Any] = {
    "port": port,
    "tool_service_port": tool_service_port,
    # Use local stores by default so state persists between restarts.
    "session_store": os.getenv("PARLANT_SESSION_STORE", "local"),
    "customer_store": os.getenv("PARLANT_CUSTOMER_STORE", "local"),
    # Allow database migrations on startup in this dedicated server app.
    "migrate": True,
  }

  nlp_service = _get_nlp_service()
  if nlp_service is not None:
    server_kwargs["nlp_service"] = nlp_service

  print(
    f"Starting Parlant server on port {port} "
    f"(tool service port {tool_service_port})..."
  )

  # The Server context manager starts the HTTP API and playground.
  async with p.Server(**server_kwargs):
    print("Parlant server is running. Press Ctrl+C to stop.")
    # Keep the process alive until it is terminated.
    stop_event = asyncio.Event()
    try:
      await stop_event.wait()
    except (KeyboardInterrupt, SystemExit):
      print("Shutting down Parlant server...")


def main() -> None:
  asyncio.run(_run_server())


if __name__ == "__main__":
  main()

