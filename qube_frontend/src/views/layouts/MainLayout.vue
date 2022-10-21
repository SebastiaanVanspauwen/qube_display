<template>
    <div class="flex flex-col min-h-screen">
      <Header />
      <div class="flex-1 justify-center items-center">
        <main class="">
          <section class="min-w-[750px] w-[80%] justify-center m-auto">
            <slot />
          </section>
        </main>
      </div>
      <BottomFooter />
    </div>
  </template>