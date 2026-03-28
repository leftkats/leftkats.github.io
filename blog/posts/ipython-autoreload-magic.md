# AutoReload Magic: Seamless Module Reloading in IPython

Published: `2025-12-10T11:30:00Z`

If you work in IPython while editing local modules, re-importing manually can interrupt your flow.
This setup enables automatic module reloading on startup so changes are picked up immediately.

## Overview

With this configuration, IPython runs:

```python
%load_ext autoreload
%autoreload 2
```

That means updated modules are reloaded automatically, keeping your session in sync with your latest code.

## Steps to enable autoreload

### 1) Launch IPython

Open your terminal and start IPython.

### 2) Locate or create your IPython profile

Run:

```bash
ipython locate profile
ipython profile create
```

### 3) Go to the profile directory

Use the path from `ipython locate profile`.

### 4) Open (or create) `ipython_config.py`

In that profile directory, edit:

```text
ipython_config.py
```

### 5) Add autoreload startup lines

Make sure this is present:

```python
c.InteractiveShellApp.exec_lines = ['%load_ext autoreload', '%autoreload 2']
```

If `exec_lines` already exists, replace it with the line above.

### 6) Save and exit

Write the file and close your editor.

### 7) Restart IPython

Start IPython again and confirm the extension is active.

## Done

You are all set: update code, save, and test without restarting your session.
