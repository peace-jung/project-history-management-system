/*
Created		2017-10-23
Modified		2017-12-15
Project		
Model		
Company		
Author		
Version		
Database		mySQL 5 
*/


Create table Users (
	id Varchar(20) NOT NULL,
	name Varchar(20) NOT NULL,
	password Varchar(20) NOT NULL,
	major Varchar(20) NOT NULL DEFAULT 'N',
	grade Varchar(20) NOT NULL DEFAULT 'N',
	address Varchar(20) NOT NULL,
	enrollment Varchar(20) NOT NULL DEFAULT 'N',
	vip Bool NOT NULL DEFAULT false,
	caution Int NOT NULL DEFAULT 0,
	user_type Varchar(20) NOT NULL,
	professor Varchar(20) NOT NULL,
 Primary Key (id)) ENGINE = InnoDB;

Create table Projects (
	project_number Int NOT NULL AUTO_INCREMENT,
	title Varchar(50) NOT NULL,
	description Varchar(500) NOT NULL,
	project_type Varchar(5) NOT NULL,
	leader Int NOT NULL,
	leader_name Varchar(20) NOT NULL,
	leader_grade Int NOT NULL,
	imageURL Varchar(100) NOT NULL,
	resultURL Varchar(20) NOT NULL,
	date Date NOT NULL,
	newest Bool NOT NULL,
	topic Varchar(100) NOT NULL,
	avg_point Float NOT NULL,
 Primary Key (project_number)) ENGINE = InnoDB;

Create table ReferenceData (
	reference_number Int NOT NULL AUTO_INCREMENT,
	project_number Int NOT NULL,
	refer_context Varchar(20) NOT NULL,
	url Varchar(100),
	refer_book Varchar(20),
 Primary Key (reference_number)) ENGINE = InnoDB;

Create table Wins (
	wins_number Int NOT NULL AUTO_INCREMENT,
	patent_number Int,
	contest_number Int,
	paper_number Int,
	wins_type Varchar(5) NOT NULL,
	title Varchar(100) NOT NULL,
	date Date NOT NULL,
 Primary Key (wins_number)) ENGINE = InnoDB;

Create table Assessment (
	id Varchar(20) NOT NULL,
	project_number Int NOT NULL,
	point Int NOT NULL,
	context Varchar(20) NOT NULL,
 Primary Key (id,project_number)) ENGINE = InnoDB;

Create table TeamMembers (
	id Varchar(20) NOT NULL,
	project_number Int NOT NULL,
	part Varchar(100) NOT NULL,
 Primary Key (id,project_number)) ENGINE = InnoDB;

Create table ReferenceRelation (
	reference Int NOT NULL,
	referenced Int NOT NULL,
	refer_context Varchar(200) NOT NULL,
	project_title Varchar(50) NOT NULL,
 Primary Key (reference,referenced)) ENGINE = InnoDB;

Create table Contest (
	contest_number Int NOT NULL AUTO_INCREMENT,
	contest_context Varchar(200) NOT NULL,
	host Varchar(20) NOT NULL,
	award Varchar(20) NOT NULL,
 Primary Key (contest_number)) ENGINE = InnoDB;

Create table Paper (
	paper_number Int NOT NULL AUTO_INCREMENT,
	summary Varchar(200) NOT NULL,
	paper_type Varchar(20) NOT NULL,
	academy Varchar(20) NOT NULL,
	submission Varchar(20) NOT NULL,
 Primary Key (paper_number)) ENGINE = InnoDB;

Create table Patent (
	patent_number Int NOT NULL,
	patent_context Varchar(100) NOT NULL,
	regist_number Int,
	regist_date Date,
 Primary Key (patent_number)) ENGINE = InnoDB;

Create table ProjectWins (
	project_number Int NOT NULL,
	wins_number Int NOT NULL,
 Primary Key (project_number,wins_number)) ENGINE = InnoDB;

Create table Author (
	author_num Int NOT NULL,
	paper_number Int NOT NULL,
	author_name Varchar(20) NOT NULL,
	author_ID Int,
 Primary Key (author_num,paper_number)) ENGINE = InnoDB;

Create table Inventor (
	inventor_num Int NOT NULL,
	patent_number Int NOT NULL,
	inventor_name Varchar(20) NOT NULL,
	inventor_ID Int,
 Primary Key (inventor_num,patent_number)) ENGINE = InnoDB;

Create table Cart (
	id Varchar(20) NOT NULL,
	project_number Int NOT NULL,
 Primary Key (id,project_number)) ENGINE = InnoDB;


Alter table TeamMembers add Foreign Key (id) references Users (id) on delete  restrict on update cascade;
Alter table Assessment add Foreign Key (id) references Users (id) on delete  restrict on update cascade;
Alter table Cart add Foreign Key (id) references Users (id) on delete  restrict on update  restrict;
Alter table ReferenceRelation add Foreign Key (reference) references Projects (project_number) on delete  restrict on update cascade;
Alter table ReferenceRelation add Foreign Key (referenced) references Projects (project_number) on delete  restrict on update cascade;
Alter table ReferenceData add Foreign Key (project_number) references Projects (project_number) on delete cascade on update cascade;
Alter table TeamMembers add Foreign Key (project_number) references Projects (project_number) on delete  restrict on update cascade;
Alter table Assessment add Foreign Key (project_number) references Projects (project_number) on delete  restrict on update cascade;
Alter table ProjectWins add Foreign Key (project_number) references Projects (project_number) on delete  restrict on update  restrict;
Alter table Cart add Foreign Key (project_number) references Projects (project_number) on delete  restrict on update  restrict;
Alter table ProjectWins add Foreign Key (wins_number) references Wins (wins_number) on delete  restrict on update  restrict;
Alter table Wins add Foreign Key (contest_number) references Contest (contest_number) on delete  restrict on update cascade;
Alter table Wins add Foreign Key (paper_number) references Paper (paper_number) on delete  restrict on update cascade;
Alter table Author add Foreign Key (paper_number) references Paper (paper_number) on delete cascade on update cascade;
Alter table Wins add Foreign Key (patent_number) references Patent (patent_number) on delete  restrict on update cascade;
Alter table Inventor add Foreign Key (patent_number) references Patent (patent_number) on delete cascade on update cascade;


