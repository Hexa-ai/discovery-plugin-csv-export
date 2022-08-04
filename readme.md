# Discovery-plugin-csv-export

Plugin for the dashborad as code Discovery tool from SenX company.

## Installation

```npm install @hexa-ai/discovery-plugin-csv-export```

## Use

```
<!DOCTYPE html>
<html dir="ltr" lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0" />
    <title>Démo Discovery-plugin-csv-export</title>

<!-- Import Discovery -->
    <script nomodule src="https://unpkg.com/@senx/discovery-widgets/dist/discovery/discovery.js"></script>
    <script type="module" src="https://unpkg.com/@senx/discovery-widgets/dist/discovery/discovery.esm.js"></script>

<!-- Import your plugin -->
    <script type="module" src="./build/discovery-plugin-csv-export.esm.js"></script>
    <script nomodule src="./build/discovery-plugin-csv-export.js"></script>

 </head>
  <body>
<!-- Define a one tile dashboard with "radar" as a chart type and random values -->
    <discovery-dashboard url="http://localhost:8080/api/v0/exec" dashboard-title="Test" debug>
      {
        'title' 'Test'
        'description' 'Dashboard test'
        'vars' { 'dt' [ NOW NOW ]  }
        'tiles' [
          {
            'title' 'test'
            'x' 0 'y' 0 'w' 12 'h' 2
            'type' 'csv-export'
            'macro' <%
              1 4 <% DROP
              NEWGTS 'g' STORE
              1 10 <%
                'ts' STORE $g $ts RAND + STU * NOW + NaN NaN NaN RAND ADDVALUE DROP
              %> FOR
              $g
              %> FOR STACKTOLIST 'gts' STORE

              // List of classnames
              $gts <% NAME %> FOREACH STACKTOLIST 'classnames' STORE
              // CSV header
              [ 'timestamp' ] $classnames APPEND 'header' STORE
              // CSV Body init
              [ ] 'body' STORE


              // Append datas to CSV Body
              [ $gts [ ] <%
                'parameter' STORE
                $parameter  0 GET 'ts' STORE
                $parameter 7 GET 'values' STORE


                [ $ts ] $values APPEND 'line' STORE

                [ $line ] $body APPEND 'body' STORE

                [ NOW NaN NaN NaN 0 ]

              %> MACROREDUCER ] REDUCE DROP
              // Append boy to CSV
              [ $header ] $body APPEND 'return' STORE

              // Return the CSV
              $return
            %>
              'options' { 'button' { 'label' 'Téléchargement' } }
          }
        ]
      }
      </discovery-dashboard>
  </body>
</html>
```

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

## License

Distributed under the MIT License. See LICENSE.txt for more information.

(back to top)

## Contact
TALBOURDET Julien - https://hexa-ai.fr - contact@hexa-ai.fr

Project Link: https://github.com/Hexa-ai/discovery-plugin-csv-export