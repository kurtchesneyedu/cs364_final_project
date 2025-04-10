-- C2C Daniel Detjen 
-- C2C Kurt Chesney
-- P02
-- Doc Statement: Used class slides and examples of sql code AND ERs and Schemas. I googled how to
-- do a timestamp in sql, gemini gave me the syntax. You can see this in the session Table.

--CREATE Tables***
CREATE TABLE Coach (
    coach_id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE
);

CREATE TABLE Team (
    team_id INTEGER PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL,
    coach_id INTEGER,
    FOREIGN KEY (coach_id) REFERENCES Coach(coach_id)
);

CREATE TABLE Athlete (
    athlete_id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(50),
    email VARCHAR(255) UNIQUE,
    team_id INTEGER,
    FOREIGN KEY (team_id) REFERENCES Team(team_id)
);

CREATE TABLE Session (
    session_id INTEGER PRIMARY KEY,
    athlete_id INTEGER,
    session_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (athlete_id) REFERENCES Athlete(athlete_id)
);

CREATE TABLE Split (
    split_id INTEGER PRIMARY KEY,
    session_id INTEGER,
    split_order INTEGER NOT NULL,
    split_time FLOAT NOT NULL,
    FOREIGN KEY (session_id) REFERENCES Session(session_id)
);

-- INSERT Statements***

-- Coaches
INSERT INTO Coach (coach_id, name, email) VALUES
    (1, 'Coach 1', 'coach1@afa.edu'),
    (2, 'Coach 2', 'coach2@afa.edu'),
    (3, 'Coach 3', 'coach3@afa.edu');

-- Teams
INSERT INTO Team (team_id, team_name, coach_id) VALUES
    (1, 'Football', 1),
    (2, 'Swim', 2),
    (3, 'Track', 3);

-- Athletes
INSERT INTO Athlete (athlete_id, name, gender, email, team_id) VALUES
    (1, 'Football 1', 'Male', 'football1@afa.edu', 1),
    (2, 'Football 2', 'Male', 'football2@afa.edu', 1),
    (3, 'Football 3', 'Female', 'football3@afa.edu', 1),
    (4, 'Football 4', 'Female', 'football4@afa.edu', 1),
    (5, 'Swimmer 1', 'Male', 'swimmer1@afa.edu', 2),
    (6, 'Swimmer 2', 'Female', 'swimmer2@afa.edu', 2),
    (7, 'Swimmer 3', 'Male', 'swimmer3@afa.edu', 2),
    (8, 'Swimmer 4', 'Female', 'swimmer4@afa.edu', 2),
    (9, 'Runner 1', 'Male', 'runner1@afa.edu', 3),
    (10, 'Runner 2', 'Female', 'runner2@afa.edu', 3),
    (11, 'Runner 3', 'Male', 'runner3@afa.edu', 3),
    (12, 'Runner 4', 'Female', 'runner4@afa.edu', 3);

-- Sessions
INSERT INTO Session (session_id, athlete_id) VALUES
    (1, 1), (2, 2), (3, 3), (4, 4),
    (5, 5), (6, 6), (7, 7), (8, 8),
    (9, 9), (10, 10), (11, 11), (12, 12);

-- Splits
INSERT INTO Split (split_id, session_id, split_order, split_time) VALUES
    (1, 1, 1, 1.25), (2, 1, 2, 2.45),
    (3, 2, 1, 1.15), (4, 2, 2, 2.35),
    (5, 3, 1, 1.10), (6, 3, 2, 2.20),
    (7, 4, 1, 1.05), (8, 4, 2, 2.00),
    (9, 5, 1, 0.98), (10, 5, 2, 1.45),
    (11, 6, 1, 1.12), (12, 6, 2, 1.90),
    (13, 7, 1, 1.20), (14, 7, 2, 1.95),
    (15, 8, 1, 1.18), (16, 8, 2, 1.80),
    (17, 9, 1, 1.31), (18, 9, 2, 2.10),
    (19, 10, 1, 1.10), (20, 10, 2, 2.30),
    (21, 11, 1, 1.35), (22, 11, 2, 2.40),
    (23, 12, 1, 1.28), (24, 12, 2, 2.20);
