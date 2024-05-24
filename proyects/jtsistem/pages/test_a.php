<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Altura Mínima y Máxima con Bootstrap</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body, html {
            height: 100%;
            margin: 0;
        }
        .parent {
            border: 1px solid black;
            display: flex;
            flex-direction: row;
            align-items: stretch;
            transition: height 1s ease;
        }
        .child1 {
            background-color: lightcoral;
            overflow: auto;
            transition: height 1s ease;
        }
        .child2 {
            background-color: lightblue;
            min-height: 600px;
            flex: 1;
        }
    </style>
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">Navbar</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item active">
                    <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Features</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Pricing</a>
                </li>
            </ul>
        </div>
    </nav>

    <div class="container-fluid">
        <div class="row parent" id="parent" style="height: auto;">
            <div class="col-md-6 child1" id="child1">
                Contenido del primer div que puede cambiar de tamaño y ser mayor que la pantalla.
            </div>
            <div class="col-md-6 child2" id="child2">
                Este div siempre ocupa el 100% de la altura del padre.
            </div>
        </div>
    </div>

    <script>
        function adjustChild1Height() {
            const child1 = document.getElementById('child1');
            const parent = document.getElementById('parent');
            const newHeight = Math.floor(Math.random() * 2000) + 300; // Altura entre 300px y 2300px
            child1.style.height = newHeight + 'px';

            // Ajustar el tamaño del padre para que coincida con el tamaño del child1
            setTimeout(() => {
                parent.style.height = child1.scrollHeight + 'px';
            }, 1000); // Debe coincidir con la duración de la transición
        }

        setInterval(adjustChild1Height, 4000); // Ajusta la altura del primer hijo cada 4 segundos
    </script>
</body>
</html>
