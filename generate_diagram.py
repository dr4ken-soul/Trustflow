import os
from PIL import Image, ImageDraw, ImageFont

diagram = """
                    +-----------------------+
                    |    frontend react     |
                    |  vite typescript      |
                    |  tailwind zustand     |
                    +-----------+-----------+
                                |
                                | https
                                v
                    +-----------+-----------+
                    |    backend node js    |
                    |    express server     |
                    |    running on ecs     |
                    +-----+---------+-------+
                          |         |
             +------------+         +------------+
             |                                    |
             v                                    v
  +----------+----------+              +----------+----------+
  |   alibaba cloud oss |              |   qwen cloud api    |
  |   document storage  |              |   dashscope intl    |
  |   trustflow-docs    |              |   qwen-vl-max       |
  |   singapore region  |              |   qwen-max          |
  +---------------------+              +---------------------+
             |
             | signed url
             v
  +----------+----------+
  |   qwen vl reads     |
  |   document via      |
  |   signed oss url    |
  +---------------------+

             +------------+
             |            |
             v            |
  +----------+----------+ |
  |   sqlite database   | |
  |   on ecs instance   | |
  |   clients docs      | |
  |   invoices payments | |
  |   escalations       | |
  +---------------------+ |
"""

img = Image.new('RGB', (800, 800), color=(255, 255, 255))
d = ImageDraw.Draw(img)

try:
    font = ImageFont.truetype("consola.ttf", 15)
except Exception:
    font = ImageFont.load_default()

d.text((10, 10), diagram, fill=(0, 0, 0), font=font)
img.save('architecture_diagram.png')
print("Image saved successfully.")
