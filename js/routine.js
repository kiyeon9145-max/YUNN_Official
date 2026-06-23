// routine.js — routine.html 진입점: 인스턴스 생성 및 의존성 주입

import { RoutineRepository } from './repository/RoutineRepository.js';
import { RoutineDomain }     from './domain/RoutineDomain.js';
import { RoutineScreen }     from './ui/RoutineScreen.js';
import { ReminderModal }     from './ui/ReminderModal.js';
import { PhotoManager }      from './ui/PhotoManager.js';
import { AppController }     from './controller/AppController.js';

const repo    = new RoutineRepository();
const domain  = new RoutineDomain(repo);
const screen  = new RoutineScreen();
const modal   = new ReminderModal();
const photos  = new PhotoManager();
const app     = new AppController();

screen.setDeps(domain);
photos.setDeps(repo, domain);
app.setDeps(domain, repo, screen, modal, photos);

document.addEventListener('DOMContentLoaded', () => app.init());
