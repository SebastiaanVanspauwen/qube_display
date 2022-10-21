<template>
    <div class="m-auto w-[780px] h-full text-center ">
        <video autoplay loop ref="myVideoPlayer">
            <source src="https://rotato.netlify.app/alpha-demo/movie-hevc.mov" type="video/mp4; codecs=hvc1"/>
            <source src="https://rotato.netlify.app/alpha-demo/movie-webm.webm" type="video/webm">
            Sorry, your browser doesn't support embedded videos.
        </video>

        <div class="text-centered">
            <h2> The QUBE is currently disconnected</h2>
        </div>
    </div>
</template>