function LoadingScreenAnim() {
    const clash = () => (
        <svg className="clash" width="76" height="66" viewBox="0 0 76 66" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M27.5669 65.2867C27.5669 65.2867 13.7566 18.3178 9.02582 15.2898C4.29506 12.2619 -1.13571 14.0577 1.06951 25.0644C3.27473 36.071 27.5669 65.2867 27.5669 65.2867Z" fill="#8BA8BE" />
            <path d="M38.9395 40.8968C38.9395 40.8968 38.5772 5.13485 36.3766 2.02849C34.176 -1.07786 30.8117 -0.953247 30.3121 7.21212C29.8125 15.3775 38.9395 40.8968 38.9395 40.8968Z" fill="#8BA8BE" />
            <path d="M54.3817 49.4958C54.3817 49.4958 59.399 14.0857 57.6904 10.6839C55.9817 7.28204 52.6369 6.89954 50.9156 14.897C49.1943 22.8945 54.3817 49.4958 54.3817 49.4958Z" fill="#8BA8BE" />
            <path d="M71.0106 42.0312C71.0106 42.0312 76.3026 21.0713 75.6029 18.9384C74.9032 16.8055 73.086 16.394 71.5664 21.0958C70.0469 25.7976 71.0106 42.0312 71.0106 42.0312Z" fill="#8BA8BE" />
        </svg>
    )

    const leftCymbal = () => (
        <svg className="leftCymbal" width="111" height="356" viewBox="0 0 111 356" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.7283 130C15.8121 152.35 10.3295 202.755 19.7283 225.572C31.4769 254.094 37.0961 261.099 43.2258 295.625C49.3555 330.151 39.139 362.676 19.7283 348.665C0.317652 334.655 -2.74728 266.603 19.7283 130Z" stroke="#B5CBD5" stroke-width="7" stroke-linejoin="round" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M19.2866 103.45C22.4594 116.984 26.3505 144.5 26.3505 144.5C26.3505 144.5 8 142 5.50003 126C3.00007 110 19.2866 103.45 19.2866 103.45Z" fill="#678399" />
            <path d="M26.3503 144.5C26.3503 144.5 20 123.5 19.2864 103.45C17.3453 76.3632 17 52 23.9821 23.0013C30 9.5 31.9653 5.90007 42.2097 0.250184C46.9728 -0.104502 51.2498 0.883276 55.0404 3.2134C59.8861 6.62551 63.7075 10.483 66.5049 14.786C78.9743 35.5146 88.1062 56.837 93.9016 78.7534C103.715 113.045 109.143 147.52 110.188 182.176C110.203 198.478 108.004 214.518 103.59 230.298C101.143 235.308 97.5071 239.737 92.6841 243.584C86.374 246.093 80.3167 245.561 74.5097 241.989C67.6231 237.091 62.1965 231.562 58.23 225.4C43.0995 199.137 37 182.176 26.3503 144.5Z" fill="#426077" />
            <path d="M79.6827 188.733C90.5163 186.152 93.8521 154.456 87.1335 117.936C80.4149 81.416 66.186 53.9027 55.3524 56.483C54.9669 56.5748 54.5909 56.7035 54.2245 56.868C63.5305 56.6488 75.4657 81.2708 81.3855 113.448C87.534 146.87 84.8648 175.786 75.4237 178.034C65.9826 180.283 53.3446 155.013 47.1961 121.592C46.5458 118.057 45.9941 114.573 45.5387 111.165C46.1034 116.371 46.8881 121.771 47.9017 127.28C54.6203 163.8 68.8491 191.313 79.6827 188.733Z" fill="#223848" />
        </svg>
    )

    const rightCymbal = () => (
        <svg className="rightCymbal" width="124" height="355" viewBox="0 0 124 355" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M112.61 138C137.543 41.7051 116.746 -6.328 85 1.5C3.89037 21.5001 -8.50016 167 5.49984 219.5C19.4998 272 83.6096 250 112.61 138Z" fill="#678399" />
            <path d="M43.5049 37.0558C25.9049 62.2558 21.8382 84.5558 22.0049 92.5558C42.0048 26.5558 71.0049 11.0558 83.0049 11.5558C77.1715 9.55581 61.1048 11.8558 43.5049 37.0558Z" fill="#8BA8BE" />
            <path d="M50.6304 54.2392C36.2053 76.1775 32.8723 95.5912 33.0089 102.556C49.401 45.0982 73.1696 31.6044 83.0049 32.0397C78.2238 30.2985 65.0555 32.3008 50.6304 54.2392Z" fill="#8BA8BE" />
            <path d="M59.0478 72.8495C48.3732 88.608 45.9067 102.553 46.0078 107.556C58.138 66.2834 75.7268 56.5907 83.0049 56.9034C79.4669 55.6527 69.7223 57.091 59.0478 72.8495Z" fill="#8BA8BE" />
            <path d="M68.3265 184.401C77.2787 174.363 80.995 164.555 81.7341 160.905C67.8247 189.294 55.6761 194.006 51.3405 192.814C53.2724 194.192 59.3743 194.439 68.3265 184.401Z" fill="#8BA8BE" />
            <path d="M70.4226 199.043C82.623 185.011 87.736 171.343 88.7674 166.263C69.7016 205.85 53.2214 212.506 47.3645 210.885C49.967 212.785 58.2221 213.075 70.4226 199.043Z" fill="#8BA8BE" />
            <path d="M71.9684 212.476C86.6035 196.494 92.6201 180.826 93.799 174.989C71.1932 220.307 51.2398 227.727 44.0888 225.773C47.284 228 57.3332 228.458 71.9684 212.476Z" fill="#8BA8BE" />
            <path d="M67.4999 117C71.4999 103 79.1666 94.1667 82.4999 91.5C89.3333 96 101.7 109.9 96.5 129.5C91.3 149.1 76.6666 153.333 69.9999 153C67.4999 146.833 63.4999 131 67.4999 117Z" fill="#8BA8BE" />
            <path d="M88.0003 129C91.8337 151.333 97.2003 201.7 88.0003 224.5C76.5003 253 71 260 65 294.5C59 329 69.0003 361.5 88.0003 347.5C107 333.5 110 265.5 88.0003 129Z" stroke="#B5CBD5" stroke-width="7" stroke-linejoin="round" />
        </svg>
    )
    return (
        <div className="loadingContainer">
            {clash()}
            {leftCymbal()}
            {rightCymbal()}
        </div>
    )
}

export default LoadingScreenAnim;