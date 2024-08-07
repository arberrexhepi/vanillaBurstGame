ë.frozenVanilla("myfooterConfig", function () {
  ///this is as basic as a Shared package function aka Scoop can get!
  let myfooterConfig = {
    myfooter: {
      role: "component",
      render: "pause",
      fetchDOM: true,
      container: "myfooter-wrapper",
      classNames: "footer",
      originBurst: {
        namespace: null,
      },
      components: {
        footerlinks: {
          id: "footerlinks",
          container: "myfooter-wrapper",
          dir: "myfooter/",
          classNames: "footerlinks",
          cache: true,
          children: `
          <ul id="linklist">
          <!--links will show up here-->
          </ul>`,
        },
      },
    },
  };

  return myfooterConfig;
});
