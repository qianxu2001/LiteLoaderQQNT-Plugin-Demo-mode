const { getConfig, setConfig } = window.demoMode;
const { plugin: pluginPath, data: dataPath } = LiteLoader.plugins["demo-mode"].path;

const DEMO_MODE_BTN_HTML = `
<div
  id="demoModeBtn"
  style="app-region: no-drag; display: flex; height: 24px; justify-content: center; margin-bottom: 16px"
>
  <i style="display: inline-flex; justify-content: center; align-items: center; color: var(--icon_primary)">
    <svg x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 42.470703 3.9863281 A 1.50015 1.50015 0 0 0 41.439453 4.4394531 L 28.025391 17.853516 C 28.02058 17.85139 28.016533 17.847821 28.011719 17.845703 L 25.652344 20.205078 C 25.657802 20.206406 25.662515 20.209597 25.667969 20.210938 L 17.210938 28.667969 C 17.209447 28.661908 17.206553 28.656457 17.205078 28.650391 L 14.845703 31.009766 C 14.848052 31.015107 14.851157 31.020054 14.853516 31.025391 L 4.4394531 41.439453 A 1.50015 1.50015 0 1 0 6.5605469 43.560547 L 16.513672 33.607422 C 18.345732 35.683816 21.01901 37 24 37 C 29.514 37 34 32.514 34 27 C 34 24.019566 32.683637 21.345974 30.607422 19.513672 L 35.052734 15.068359 C 39.90447 17.90912 43.668811 22.496845 45.050781 27.869141 C 45.220781 28.549141 45.83 29 46.5 29 C 46.62 29 46.749141 28.989219 46.869141 28.949219 C 47.679141 28.749219 48.159219 27.930859 47.949219 27.130859 C 46.409379 21.128251 42.461227 16.073087 37.277344 12.84375 L 43.560547 6.5605469 A 1.50015 1.50015 0 0 0 42.470703 3.9863281 z M 23.990234 9 C 12.820234 9 2.7507813 16.620859 0.05078125 27.130859 C -0.15921875 27.930859 0.32085937 28.749219 1.1308594 28.949219 C 1.9308594 29.159219 2.7492187 28.679141 2.9492188 27.869141 C 5.2792187 18.819141 14.330234 12 23.990234 12 C 25.700234 12 27.389531 12.209141 29.019531 12.619141 L 31.480469 10.160156 C 29.090469 9.4001562 26.570234 9 23.990234 9 z M 24 17 C 18.486 17 14 21.486 14 27 C 14 27.197 14.017297 27.390938 14.029297 27.585938 L 17.751953 23.863281 C 18.428953 22.521281 19.521281 21.428953 20.863281 20.751953 L 24.583984 17.029297 C 24.389984 17.017297 24.197 17 24 17 z M 28.472656 21.648438 C 30.00901 22.931321 31 24.845705 31 27 C 31 30.859 27.86 34 24 34 C 21.845705 34 19.931321 33.009291 18.648438 31.472656 L 21.488281 28.632812 A 3 3 0 0 0 24 30 A 3 3 0 0 0 25.632812 24.488281 L 28.472656 21.648438 z"
        fill="currentColor"
      />
    </svg>
  </i>
</div>
`;
const DEMO_MODE_BTN_STYLE_HTML = `
<style>
  #demoModeBtn i:hover {
    color: var(--brand_standard) !important;
  }
</style>
`;

const onLoad = () => {
  const findFuncMenuInterval = setInterval(() => {
    // 获取功能菜单
    const funcMenu = document.querySelector(".func-menu");
    if (funcMenu) {
      clearInterval(findFuncMenuInterval);
      // 插入演示模式按钮和悬停样式
      funcMenu.insertAdjacentHTML("afterbegin", DEMO_MODE_BTN_HTML);
      document.head.insertAdjacentHTML("beforeend", DEMO_MODE_BTN_STYLE_HTML);
      // 监听演示模式按钮点击
      const demoModeBtn = document.querySelector("#demoModeBtn");
      demoModeBtn.addEventListener("click", () => {
        // 获取演示模式样式
        const demoModeStyle = document.querySelectorAll(".demoModeStyle");
        // 开关
        if (demoModeStyle.length !== 0) {
          demoModeStyle.forEach((item) => item.remove());
        } else {
          // 获取配置
          getConfig(dataPath).then((config) => {
            const { checkbox, style } = config;
            const { blur } = style.filter;
            // 遍历配置文件中的配置
            for (const key in checkbox) {
              // 遍历配置子项
              for (const subKey in checkbox[key]) {
                // 如果配置为 true，则插入样式
                if (checkbox[key][subKey].checked) {
                  const { selector } = checkbox[key][subKey];
                  document.head.insertAdjacentHTML(
                    "beforeend",
                    `
                    <style class="demoModeStyle">
                      ${selector} {
                        filter: blur(${blur}px);
                      }
                    </style>
                    `
                  );
                }
              }
            }
          });
        }
      });
    }
  }, 100);
};
onLoad();
const onSettingWindowCreated = async (view) => {
  // 获取设置页文件路径
  const htmlFilePath = `local:///${pluginPath}/src/setting/setting.html`;
  const cssFilePath = `local:///${pluginPath}/src/setting/setting.css`;
  // 插入设置页
  const htmlText = await (await fetch(htmlFilePath)).text();
  view.insertAdjacentHTML("afterbegin", htmlText);
  // 插入设置页样式
  document.head.insertAdjacentHTML("beforeend", `<link rel="stylesheet" href="${cssFilePath}" />`);
  // 获取是否为深色模式
  const prefersColorScheme = window.matchMedia("(prefers-color-scheme: dark)");
  // 设置深色模式样式
  const setDarkStyle = () => {
    document.documentElement.style.setProperty("--fieldset-border-color", "rgba(255, 255, 255, 0.2)");
    document.documentElement.style.setProperty("--blur-item-border-bottom-color", "rgba(255, 255, 255, 0.06)");
  };
  // 如果为深色模式，则设置深色模式样式
  if (prefersColorScheme.matches) {
    setDarkStyle();
  }
  // 监听外观模式变化
  prefersColorScheme.addEventListener("change", (event) => {
    if (event.matches) {
      setDarkStyle();
    } else {
      // 移除深色模式样式
      document.documentElement.style.removeProperty("--fieldset-border-color");
      document.documentElement.style.removeProperty("--blur-item-border-bottom-color");
    }
  });
  // 获取配置
  getConfig(dataPath).then((config) => {
    // 获取设置页所有复选框
    const checkboxes = view.querySelectorAll('input[type="checkbox"]');
    // 遍历复选框
    checkboxes.forEach((checkbox) => {
      // 从配置中获取复选框状态
      const { checked } = config.checkbox[checkbox.parentNode.parentNode.id][checkbox.name];
      // 设置复选框状态
      if (checked) {
        checkbox.checked = true;
      }
      // 监听复选框点击
      checkbox.addEventListener("click", () => {
        // 修改配置
        config.checkbox[checkbox.parentNode.parentNode.id][checkbox.name].checked = checkbox.checked;
        setConfig(dataPath, config);
      });
    });
    // 从配置中获取模糊度
    const { blur } = config.style.filter;
    // 获取模糊度输入框
    const blurRadiusRange = view.querySelector("#blurRadiusRange");
    const blurRadiusNumber = view.querySelector("#blurRadiusNumber");
    // 设置模糊度输入框值
    blurRadiusRange.value = blur;
    blurRadiusNumber.value = blur;

    // 监听模糊度 range 输入框变化
    blurRadiusRange.addEventListener("input", () => {
      // 将值同步到 number 输入框
      blurRadiusNumber.value = blurRadiusRange.value;
      // 修改配置
      config.style.filter.blur = blurRadiusRange.value;
      setConfig(dataPath, config);
    });
    // 监听模糊度 number 输入框变化
    blurRadiusNumber.addEventListener("input", () => {
      // 如果值在 1-50 之外，则将值重置
      if (blurRadiusNumber.value < 1 || blurRadiusNumber.value > 50) {
        if (blurRadiusNumber.value < 1) {
          blurRadiusNumber.value = 1;
        } else {
          blurRadiusNumber.value = 50;
        }
      }
      // 将值同步到 range 输入框
      blurRadiusRange.value = blurRadiusNumber.value;
      // 修改配置
      config.style.filter.blur = blurRadiusNumber.value;
      setConfig(dataPath, config);
    });
  });
};

export { onSettingWindowCreated };
