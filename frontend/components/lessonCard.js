// ders kartları dinamik olusturma
export function createLessonCard(lesson, idx, isAvailable, startLesson) {
  // Kart elemanını oluştur
  const card = document.createElement("div");
  // Kartın sınıf adını ayarla
  card.className = `lesson-card ${isAvailable ? 'lesson-card-available' : 'lesson-card-locked'}`;
  card.innerHTML = `
    <div class="lesson-content">
      <div class="lesson-number">Ders ${idx + 1}</div>
      <h3 class="lesson-title">${lesson.name || ''}</h3>
      <p class="lesson-description">${lesson.description || ''}</p>
    </div>
  `;
  // Kartın tıklanabilirliğini ayarla
  if (isAvailable) {
    card.onclick = () => startLesson(idx + 1);// ders başlat
  }
  return card;
}
