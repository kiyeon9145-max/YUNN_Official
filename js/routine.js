// routine.js — routine.html 진입점: 인스턴스 생성 및 의존성 주입(setDeps 패턴)
// 의존성 방향(CLAUDE.md): Screen → Domain → Repository → SessionRepository → localStorage.
// AppController가 사용자 상태를 보고 4개 스크린(guard/start/routine/compare) 중 하나로 라우팅한다.

import { RoutineRepository } from './repository/RoutineRepository.js';
import { RoutineDomain }     from './domain/RoutineDomain.js';
import { RoutineScreen }     from './ui/RoutineScreen.js';
import { ReminderModal }     from './ui/ReminderModal.js';
import { PhotoManager }      from './ui/PhotoManager.js';
import { AppController }     from './controller/AppController.js';

// 하위 계층부터 인스턴스 생성 (Domain은 Repository를 주입받아 데이터 접근)
const repo    = new RoutineRepository();
const domain  = new RoutineDomain(repo);
const screen  = new RoutineScreen();
const modal   = new ReminderModal();
const photos  = new PhotoManager();
const app     = new AppController();

// 의존성 연결
screen.setDeps(domain);                          // 화면 → 비즈니스 로직
photos.setDeps(repo, domain);                    // 사진 → 저장소, 날짜 로직
app.setDeps(domain, repo, screen, modal, photos);// 컨트롤러가 모든 객체를 조율

// DOM 준비 후 앱 초기화 → 상태 판별 → 화면 라우팅
document.addEventListener('DOMContentLoaded', () => app.init());
