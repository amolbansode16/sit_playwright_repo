# Jenkins Guide for Beginners

This guide explains how to start Jenkins on your computer and how this project's `Jenkinsfile` works. No Jenkins experience is needed.

## Contents

1. [What is Jenkins?](#1-what-is-jenkins)
2. [What is installed on this computer](#2-what-is-installed-on-this-computer)
3. [Start and stop Jenkins](#3-start-and-stop-jenkins)
4. [First-time setup (only once)](#4-first-time-setup-only-once)
5. [Create the pipeline job (only once)](#5-create-the-pipeline-job-only-once)
6. [Run the tests and see the reports](#6-run-the-tests-and-see-the-reports)
7. [The Jenkinsfile, line by line](#7-the-jenkinsfile-line-by-line)
   - [Run one spec file or one tag (Jenkinsfile-params)](#7a-run-one-spec-file-or-one-tag-jenkinsfile-params)
8. [Common errors and fixes](#8-common-errors-and-fixes)
9. [Words you will see](#9-words-you-will-see)

---

## 1. What is Jenkins?

Jenkins is a program that runs jobs for you automatically.

Without Jenkins, you open a terminal and type `npx playwright test` yourself. With Jenkins, you click one button. Jenkins then:

1. downloads the latest code from GitHub;
2. installs the packages;
3. runs all the tests;
4. saves the reports so anyone can open them.

Think of Jenkins as a helper that repeats the same steps the same way every time.

---

## 2. What is installed on this computer

| Item | Where it is | Why it is needed |
|---|---|---|
| Java 21 | `C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot` | Jenkins is written in Java and needs Java 17 or newer |
| Jenkins 2.580.1 (LTS) | `C:\Users\hp\jenkins\jenkins.war` | The Jenkins program itself, as one file |
| Start script | `C:\Users\hp\jenkins\start-jenkins.bat` | Starts Jenkins with one double-click |
| Jenkins data | `C:\Users\hp\.jenkins` | Your jobs, plugins, users, build history and settings |

📝 **Note:** Java 8 is also installed. That's fine. The start script always uses Java 21.

⚠️ **Warning:** Don't delete `C:\Users\hp\.jenkins`. You would lose all jobs and settings.

---

## 3. Start and stop Jenkins

### Start Jenkins

1. Open File Explorer and go to `C:\Users\hp\jenkins`.
2. Double-click **`start-jenkins.bat`**.
3. A black command window opens and shows a lot of text. **Keep this window open.** Jenkins runs inside it.
4. Wait about 30–60 seconds until you see this line:
   ```
   Jenkins is fully up and running
   ```
5. Open your browser and go to **http://localhost:8080**.
6. Log in with the admin username and password you created.

💡 **Tip:** Instead of double-clicking, you can type this in a terminal:
```bash
C:\Users\hp\jenkins\start-jenkins.bat
```

### Stop Jenkins

Do one of these:
- Click the black window and press **Ctrl + C**. Type `Y` if it asks.
- Or just close the black window.

### Is Jenkins running?

Open http://localhost:8080 in your browser.
- The login page opens → Jenkins is running.
- "This site can't be reached" → Jenkins is stopped. Start it again.

📝 **Note:** Jenkins does not start by itself when you restart your computer. Run `start-jenkins.bat` each time.

---

## 4. First-time setup (only once)

You do these steps only the very first time Jenkins starts.

1. **Unlock Jenkins.** The browser asks for an "Administrator password". Find it in this file:
   ```
   C:\Users\hp\.jenkins\secrets\initialAdminPassword
   ```
   Open it with Notepad, copy the text and paste it into the browser.
2. **Install plugins.** Click **Install suggested plugins**. Wait until all of them finish.
3. **Create your admin user.** Enter a username, password, name and email. Remember them.
4. **Jenkins URL.** Keep `http://localhost:8080/` and click **Save and Finish**.
5. **Install the Allure plugin.**
   - Go to **Manage Jenkins → Plugins → Available plugins**.
   - Search for **Allure**, tick it and click **Install**.
6. **Add the Allure tool.**
   - Go to **Manage Jenkins → Tools**.
   - Scroll to **Allure Commandline installations** and click **Add Allure Commandline**.
   - **Name:** `allure`
   - Tick **Install automatically** and choose the newest **2.x** version from Maven Central.
   - Click **Save**.

⚠️ **Warning:** If you skip step 6, the build fails at the end with `No Allure installation found`, even when all tests pass.

---

## 5. Create the pipeline job (only once)

A **job** tells Jenkins what to run. Our job reads its steps from the `Jenkinsfile` in GitHub.

1. On the Jenkins home page, click **New Item**.
2. Enter a name, for example `SIT`.
3. Select **Pipeline** and click **OK**.
4. Scroll down to the **Pipeline** section.
5. **Definition:** choose **Pipeline script from SCM**.
6. **SCM:** choose **Git**.
7. **Repository URL:**
   ```
   https://github.com/amolbansode16/sit_playwright_repo.git
   ```
8. **Branch Specifier:** change `*/master` to **`*/main`**.
9. **Script Path:** keep `Jenkinsfile`.
10. Click **Save**.

⚠️ **Warning:** Jenkins reads the code from **GitHub**, not from your computer. If you change the tests or the `Jenkinsfile`, commit and push first. Otherwise Jenkins runs the old version.

---

## 6. Run the tests and see the reports

### Run a build

1. Open your job (for example `SIT`).
2. Click **Build Now**.
3. A new build number (like `#1`) appears under **Build History**.

### Watch it run

1. Click the build number.
2. Click **Console Output**.
3. You see the same logs as in your terminal, for example:
   ```
   ========== Test Started : SIT:002 ==========
   [11:04:38 pm] Status code : 200
   ...
     6 passed (13.5s)
   ```

### Build result

| Icon | Meaning |
|---|---|
| ✅ Green | Every step worked and all tests passed |
| ❌ Red | A step failed. Open **Console Output** and look near the bottom. |
| ⚪ Grey | The build was cancelled or has not finished |

### Open the reports

| Report | Where to find it |
|---|---|
| **Allure Report** | On the build page, click **Allure Report** in the left menu |
| **Playwright HTML report** | On the build page, under **Build Artifacts**, open `playwright-report/index.html` |

---

## 7. The Jenkinsfile, line by line

The `Jenkinsfile` is a text file in the project root. It lists the steps Jenkins must follow. Here is the full file:

```groovy
pipeline {
    agent any

    environment {
        CI = 'true'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('Install') {
            steps {
                bat 'npm ci'
                bat 'npx playwright install chromium'
            }
        }

        stage('Clean old results') {
            steps {
                bat 'if exist allure-results rmdir /s /q allure-results'
            }
        }

        stage('Run tests') {
            steps {
                bat 'npx playwright test'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
            allure includeProperties: false, results: [[path: 'allure-results']]
        }
    }
}
```

### The big picture

```
pipeline
├── agent        → where to run
├── environment  → settings for every step
├── options      → extra rules (time limit)
├── stages       → the work, in order
│   ├── Install
│   ├── Clean old results
│   └── Run tests
└── post         → what to do at the end
```

### Each part explained

| Code | What it means |
|---|---|
| `pipeline { ... }` | Everything inside is one pipeline. Every Jenkinsfile starts like this. |
| `agent any` | Run on any available Jenkins machine. Here, that's your own computer. |
| `environment { CI = 'true' }` | Sets the variable `CI` to `true` for all steps. Our `playwright.config.js` reads it (see below). |
| `options { timeout(time: 30, unit: 'MINUTES') }` | If the build takes longer than 30 minutes, Jenkins stops it. This prevents a stuck build from running forever. |
| `stages { ... }` | The list of stages. They run in order, top to bottom. |
| `stage('Install')` | A named group of steps. The name shows on the Jenkins build page. |
| `steps { ... }` | The commands inside a stage. |
| `bat '...'` | Run a Windows command. (On Linux or Mac you would use `sh` instead.) |

### The commands

| Command | What it does |
|---|---|
| `npm ci` | Installs the exact package versions from `package-lock.json`. It's like `npm install`, but stricter and made for CI. |
| `npx playwright install chromium` | Downloads the Chromium browser Playwright needs. If it's already there, it skips the download. |
| `if exist allure-results rmdir /s /q allure-results` | Deletes the old `allure-results` folder, if it exists. So the report shows only this build. `/s` deletes all files inside; `/q` means don't ask "Are you sure?". |
| `npx playwright test` | Runs all tests in the `tests` folder. |

### What `CI = 'true'` changes

`playwright.config.js` behaves differently when `CI` is set:

| Setting | On your computer | On Jenkins (`CI=true`) |
|---|---|---|
| `retries` | 0 — a failed test fails at once | 2 — a failed test gets 2 more tries |
| `workers` | Several tests run at the same time | 1 — tests run one by one, so logs stay in order |
| `forbidOnly` | `test.only` is allowed | `test.only` fails the build, so nobody forgets it in the code |

### The `post` section

`post` runs **after** all stages.

| Code | What it means |
|---|---|
| `always { ... }` | Run these steps every time, whether the tests passed or failed. You need the reports most when tests fail. |
| `archiveArtifacts artifacts: 'playwright-report/**'` | Saves the Playwright HTML report with the build so you can open it later. `**` means "every file in every subfolder". |
| `allowEmptyArchive: true` | Don't fail the build if the report folder is missing. |
| `allure ... results: [[path: 'allure-results']]` | Builds the Allure report from `allure-results` and adds the **Allure Report** link to the build page. |
| `includeProperties: false` | Don't add Jenkins' own settings to the report's Environment section. |

### What happens when a step fails?

- A command that fails makes its stage red.
- The stages after it are **skipped**.
- `post { always { ... } }` **still runs**, so you still get the reports.

---

## 7a. Run one spec file or one tag (Jenkinsfile-params)

`Jenkinsfile-params` is a second pipeline. Before each build, it asks you which spec file and/or which tag to run.

### Tags in this project

| Tag | Tests |
|---|---|
| `@smoke` | SIT:002, SIT:003 (quick GET checks) |
| `@regression` | SIT:002, SIT:003, SIT:004, SIT:005 |

A tag is added to a test like this:
```js
test("SIT:002 | Verify product list API", { tag: ["@smoke", "@regression"] }, async({request}) =>{
```

### Create the job (only once)

Follow [Create the pipeline job](#5-create-the-pipeline-job-only-once), with two changes:
- Use a different name, for example `SIT-Params`.
- Set **Script Path** to **`Jenkinsfile-params`**.

📝 **Note:** On the very first build, Jenkins only learns about the parameters. That build runs all tests. After it, the button changes to **Build with Parameters**.

### Run it

1. Open the job and click **Build with Parameters**.
2. Fill in one, both or none of the boxes:

| SPEC_FILE | TAG | Command Jenkins runs | Tests that run |
|---|---|---|---|
| *(empty)* | *(empty)* | `npx playwright test` | All tests |
| `tests/dataForm.spec.js` | *(empty)* | `npx playwright test "tests/dataForm.spec.js"` | All tests in that file |
| *(empty)* | `@smoke` | `npx playwright test --grep "@smoke"` | Only `@smoke` tests |
| `tests/dataForm.spec.js` | `@regression` | both filters | `@regression` tests in that file |

3. Click **Build**.
4. In **Console Output**, look for the line `Running command : ...`. It shows exactly what Jenkins ran.

### How the "Run tests" stage works

```groovy
script {
    def command = 'npx playwright test'

    if (params.SPEC_FILE?.trim()) {
        command = command + " \"${params.SPEC_FILE.trim()}\""
    }

    if (params.TAG?.trim()) {
        command = command + " --grep \"${params.TAG.trim()}\""
    }

    echo "Running command : ${command}"
    bat command
}
```

| Code | What it means |
|---|---|
| `parameters { string(...) }` | Creates a text box on the **Build with Parameters** page |
| `script { ... }` | Lets you write small Groovy code (variables, `if`) inside a step |
| `def command = ...` | Makes a variable that holds the command text |
| `params.SPEC_FILE` | The value you typed in the SPEC_FILE box |
| `?.trim()` | Removes spaces. If the box is empty, the `if` is skipped. |
| `--grep "@smoke"` | Playwright option: run only tests whose title or tag matches |
| `echo` | Prints a line in Console Output |
| `bat command` | Runs the finished command |

💡 **Tip:** Test the same command on your computer first. Add `--list` to see which tests match without running them:
```bash
npx playwright test --grep "@smoke" --list
```

---

## 8. Common errors and fixes

| Error in Console Output | Why it happens | How to fix it |
|---|---|---|
| `couldn't find remote ref refs/heads/master` | The job looks for a `master` branch. This repo uses `main`. | Job → **Configure** → Branch Specifier → `*/main` |
| `No Allure installation found` | The Allure tool is not set up in Jenkins | Do step 6 in [First-time setup](#4-first-time-setup-only-once) |
| `No such DSL method 'allure'` | The Allure plugin is not installed | Do step 5 in [First-time setup](#4-first-time-setup-only-once) |
| `'npm' is not recognized` | Jenkins can't find Node.js | Install Node.js, then close and restart Jenkins |
| `This site can't be reached` in the browser | Jenkins is not running | Run `start-jenkins.bat` |
| `Address already in use` / port 8080 busy | Jenkins (or another program) is already using port 8080 | Close the other Jenkins window, or open http://localhost:8080 — it may already be running |
| `No tests found` | The SPEC_FILE path or TAG doesn't match any test | Check spelling. Tags start with `@`. Paths look like `tests/dataForm.spec.js`. |
| No **Build with Parameters** button | The job has never run, so Jenkins hasn't read the parameters yet | Click **Build Now** once, then refresh the page |
| Old code runs on Jenkins | Your latest changes are not pushed | `git push`, then **Build Now** again |
| A test fails only on Jenkins | The demo website was slow or down, or the code differs from GitHub | Check **Console Output**, open the API URL in a browser, and check the code is pushed |

💡 **Tip:** When a build fails, open **Console Output** and scroll to the **bottom**. The real error is usually in the last 20–30 lines.

---

## 9. Words you will see

| Word | Meaning |
|---|---|
| **Agent** | The machine where the build runs. Here, your own computer. |
| **Artifact** | A file Jenkins saves from a build, like a report. |
| **Build** | One run of a job. Each build gets a number: #1, #2, #3… |
| **CI** | Continuous Integration: running tests automatically whenever code changes. |
| **Console Output** | The full log of a build, like your terminal output. |
| **Job** | A saved task in Jenkins, such as "run the SIT tests". |
| **Jenkinsfile** | A text file in the project that lists the pipeline steps. |
| **LTS** | Long-Term Support: the stable Jenkins version. |
| **Pipeline** | A series of stages Jenkins runs in order. |
| **Plugin** | An add-on that gives Jenkins new features, like Allure. |
| **SCM** | Source Code Management: where the code lives, here Git and GitHub. |
| **Stage** | One named part of a pipeline, like "Install" or "Run tests". |
| **Step** | One command inside a stage. |
| **Workspace** | The folder where Jenkins downloads the code for a job: `C:\Users\hp\.jenkins\workspace\<job name>`. |
