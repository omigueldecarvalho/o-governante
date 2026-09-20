function createToast(
  achievement
) {
  const toast =
    document.createElement(
      "article"
    );

  toast.className =
    "achievement-toast";

  toast.innerHTML = `
    <span class="achievement-toast-icon">
      ${achievement.icon}
    </span>

    <div>
      <small>
        Conquista secreta desbloqueada
      </small>

      <strong>
        ${achievement.name}
      </strong>

      <p>
        ${achievement.description}
      </p>
    </div>
  `;

  return toast;
}

export function showAchievementToasts(
  achievements = []
) {
  achievements.forEach(
    (achievement, index) => {
      window.setTimeout(
        () => {
          const toast =
            createToast(
              achievement
            );

          document.body.appendChild(
            toast
          );

          requestAnimationFrame(
            () => {
              toast.classList.add(
                "visible"
              );
            }
          );

          window.setTimeout(
            () => {
              toast.classList.remove(
                "visible"
              );

              window.setTimeout(
                () => {
                  toast.remove();
                },
                300
              );
            },
            4200
          );
        },
        index * 700
      );
    }
  );
}