# Test App : https://exam1-4mbat3qata-uc.a.run.app/

Welcome to the Test App repository! This project is designed for teachers (admins) to create and manage tests with questions, and for students to register/login and take these tests. The application includes features such as timers, the ability to pause tests, tag questions for later answers, and auto-submit functionality when time ends.

## Usage

- Teachers: After logging in, teachers can create and manage tests, add questions, and monitor student progress.
- Students: Students can register/login to take tests, pause and resume tests, tag questions for later review, and complete tests within the given time frame.

## Features

- **User Authentication**: Secure login and registration system for both teachers and students.
- **Test Creation**: Teachers can create new tests with a variety of questions.
- **Timed Tests**: Tests come with a timer that auto-submits when time ends.
- **Pause and Resume**: Students can pause and resume tests.
- **Question Tagging**: Students can tag questions to revisit them later.
- **Auto Submit**: Tests auto-submit when the timer ends.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Continuous Deployment**: Integrated with GitHub Actions for continuous deployment.

## Technologies Used

- **Backend**: Go
- **Frontend**: React
- **Database**: PostgreSQL
- **API**: RESTful APIs

## Installation

### Prerequisites

- Go (1.21.5 or later)
- Node.js (16.x or later)
- PostgreSQL

### Quick Start

1. Clone the repository:

- bash : git clone https://github.com/stonoy/Exam-App.git

2. Navigate to the backend directory and install dependencies

- cd root
- go mod tidy

3. Set up the database by applying migrations
- goose postgres <database-connection-string> up

4. Navigate to the frontend directory and install dependencies

- cd client
- npm install

5. Start the frontend

- npm run dev

6. Build the frontend and copy the dist to root directory

- npm run build

7. Build and start the server

- go build -o exam1 && ./exam1

# Feel free to customize it further according to your project's specifics and requirements.
