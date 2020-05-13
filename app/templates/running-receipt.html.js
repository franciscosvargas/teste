const hbs = require('handlebars')

const template = hbs.compile(`

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en">

<head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>Grids Master Template</title>

  <style type="text/css">

    /* Outlines the grids, remove when sending */

    /* table td {
      border: 1px dotted black;
    } */

    /* CLIENT-SPECIFIC STYLES */

    body,
    table,
    td,
    a {
      font-family: 'Roboto';
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    p {
      color: #93938b;
      margin: 0;
    }

    table,
    td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    img {
      -ms-interpolation-mode: bicubic;
    }

    /* RESET STYLES */

    img {
      border: 0;
      outline: none;
      text-decoration: none;
    }

    table {
      border-collapse: collapse !important;
    }

    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
    }

    /* iOS BLUE LINKS */

    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }

    /* ANDROID CENTER FIX */

    div[style*="margin: 16px 0;"] {
      margin: 0 !important;
    }

    /* MEDIA QUERIES */

    @media all and (max-width:639px) {
      .wrapper {
        width: 320px !important;
        padding: 0 !important;
      }
      .container {
        width: 300px !important;
        padding: 0 !important;
      }
      .mobile {
        width: 300px !important;
        display: block !important;
        padding: 0 !important;
      }
      .img {
        width: 100% !important;
        height: auto !important;
      }
      *[class="mobileOff"] {
        width: 0px !important;
        display: none !important;
      }
      *[class*="mobileOn"] {
        display: block !important;
        max-height: none !important;
      }
    }

    /* Utilits */

    .route {
      border: solid 1px;
      border-radius: 50%;
      display: inline-block;
      height: 10px;
      margin-right: 15px;
      width: 10px;
    }

    .route-start {
      background-color: #30b03a;
    }

    .route-end {
      background-color: #f32f00;
    }

    .profile-driver {
      border-radius: 50%;
      float: left;
      margin-right: 20%;
      height: 75px;
      width: 75px;
    }
  </style>
</head>

<body style="margin:0; padding:0; background-color:#F2F2F2;">

  <span style="display: block; width: 640px !important; max-width: 640px; height: 1px" class="mobileOff"></span>

  <center>
    <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#F2F2F2">
      <tr>
        <td align="center" valign="top">

          <table width="640" cellpadding="0" cellspacing="0" border="0" class="wrapper" bgcolor="#FFFFFF">
            <tr>
              <td height="10" style="font-size:10px; line-height:10px;">&nbsp;</td>
            </tr>
            <tr>
              <td height="10" style="font-size:10px; line-height:10px;">&nbsp;</td>
            </tr>
          </table>

          <table width="640" cellpadding="0" cellspacing="0" border="0" class="wrapper" bgcolor="#FFFFFF">
            <tr>
              <td height="10" style="font-size:10px; line-height:10px;">&nbsp;</td>
            </tr>
            <tr>
              <td align="center" valign="top">

                <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                  <tr>
                    <td width="300" class="mobile" align="left" valign="top">
                      <h1>R$ {{price}}</h1>
                    </td>
                    <td width="300" class="mobile" align="right" valign="top">
                      <img src="https://Iuvo Club.com/wp-content/uploads/2017/09/marca-small-1.png" style="margin:0; padding:0; border:none; display:block;" border="0" alt="Logo Iuvo Club" />
                    </td>
                  </tr>
                  <tr>
                    <td align="left" valign="top" colspan="2">
                      <p>Obrigado por escolher o Iuvo Club, {{userName}}</p>
                      <br>
                      <p><strong> {{date}} | {{service}} </strong></p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" valign="top" colspan="2">
                      <hr>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" valign="top" colspan="2" style="font-size: 16px; line-height: 66px">
                      <span class="route route-end"></span>{{created_at}} |
                      <a href="#">{{originAddresses}}</a>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" valign="top" colspan="2" style="font-size: 16px; line-height: 66px">
                      <span class="route route-start"></span>{{updated_at}} |
                      <a href="#">{{destinationAddresses}}</a>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" valign="top" colspan="2">
                      <hr>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>
            <tr>
              <td height="10" style="font-size:10px; line-height:10px;">&nbsp;</td>
            </tr>
          </table>

          <table width="640" cellpadding="0" cellspacing="0" border="0" class="wrapper" bgcolor="#FFFFFF">
            <tr>
              <!-- <td height="10" style="font-size:10px; line-height:10px;">&nbsp;</td> -->
            </tr>
            <tr>
              <td align="center" valign="top">
                <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                  <tr>
                    <td width="400" class="mobile" align="center" valign="top">
                      <table cellpadding="0" cellspacing="0" border="1" align="center" class="wrapper" bgcolor="#FFFFFF" 
                      style="color:#93938b; text-align:center; border:solid 1px #93938b; border-collapse:collapse; height:50px;
                      width:300px">
                        <caption height="100" style="line-height:70px;" align="center">
                          Você viajou com {{driverName}}
                        </caption>
                        <thead border="1">
                          <th>Quilômetros</th>
                          <th>Duração</th>
                          
                        </thead>
                        <tbody border="1">
                          <td>{{kilometers}}</td>
                          <td>{{duration}}</td>
                          
                        </tbody>
                      </table>
                    </td>
                    <td width="100" class="mobile" align="center" valign="top">
                    </td>
                  </tr>
                  <tr>
                    <td align="center" valign="top" colspan="3" height="40" style="font-size:40px; line-height:40px;">
                      <hr>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td height="10" style="font-size:10px; line-height:10px;">&nbsp;</td>
            </tr>
          </table>

          <table width="640" cellpadding="0" cellspacing="0" border="0" class="wrapper" bgcolor="#FFFFFF">
            <tr>
              <td height="10" style="font-size:10px; line-height:10px;">&nbsp;</td>
            </tr>
            <tr>
              <td align="center" valign="top">
                <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                  <tr>
                    <td width="100" class="mobile" align="left" valign="top">
                      <img src="https://www.iconsdb.com/icons/preview/caribbean-blue/message-2-xxl.png" width="75" height="75" style="margin:0; padding:0; border:none; display:block;"
                        border="0" alt="Mensagem" />
                    </td>
                    <td width="400" class="mobile" align="center" valign="top">
                      <p>
                        <strong> Os locais e distâncias são calculados automaticamente e podem sofrer imprecisão. </strong>
                      </p>
                    </td>
                    <td width="100" class="mobile" align="center" valign="top">
                    </td>
                  </tr>
                  <tr>
                    <td align="center" valign="top" colspan="3" height="40" style="font-size:40px; line-height:40px;">
                      <hr>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td height="10" style="font-size:10px; line-height:10px;">&nbsp;</td>
            </tr>
          </table>

          <table width="640" cellpadding="0" cellspacing="0" border="0" class="wrapper" bgcolor="#FFFFFF">
            <tr>
              <td height="10" style="font-size:10px; line-height:10px;">&nbsp;</td>
            </tr>
            <tr>
              <td align="center" valign="top">

                <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                  <tr>
                    <td width="100" class="mobile" align="left" valign="top">
                        <img src="https://Iuvo Club.com/wp-content/uploads/2017/09/marca-small-1.png" style="margin:0; padding:0; border:none; display:block;" border="0" alt="Logo Iuvo Club" />
                    </td>
                    <td width="270" class="mobile" align="center" valign="top">

                    </td>
                    <td width="70" class="mobile" align="left" valign="top">
                      <a href="https://www.facebook.com/Iuvo Club/">
                        <img src="http://blog.lojadatatuagem.com.br/wp-content/uploads/2017/05/facebook-transparent-logo-png-0.png" width="35" height="35" style="margin:0; padding:0; border:none; display:block;"
                          border="0" alt="Facebook Iuvo Club" />
                      </a>
                    </td>
                    <td width="70" class="mobile" align="left" valign="top">
                      <a href="https://twitter.com/Iuvo Clubapp">
                        <img src="https://logos-download.com/wp-content/uploads/2016/02/Twitter_logo_bird_transparent_png.png" width="35" height="35" style="margin:0; padding:0; border:none; display:block;"
                          border="0" alt="Twitter Iuvo Club" />
                      </a>
                    </td>
                    <td width="70" class="mobile" align="left" valign="top">
                        <a href="https://www.instagram.com/Iuvo Clubapp/">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/7/76/Instagram.pn.png" width="35" height="35"
                        style="margin:0; padding:0; border:none; display:block;" border="0" alt="Instagram Iuvo Club" />
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td height="10" style="font-size:10px; line-height:10px;">&nbsp;</td>
                  </tr>
                  <tr>
                    <td width="600" class="mobile" align="left" valign="top" colspan="5">
                      <p>
                        Precisa de ajuda?
                        <br/> Toque em Ajuda no app para entrar em contato com dúvidas sobre a sua viagem.
                        <br/> Esqueceu alguma coisa? Encontrar objeto perdido.
                      </p>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>
            <tr>
              <td height="10" style="font-size:10px; line-height:10px;">&nbsp;</td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </center>
</body>
</html>


`)

module.exports = template
