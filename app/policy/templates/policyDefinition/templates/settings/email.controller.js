app.controller("EmailNotificationTemplateController", ($scope) => {

    $scope.template = `<html>
    <head>
        <style>
        </style>
    </head>

    <body bgcolor='#EAF1DD' lang=EN-US style='tab-interval:36.0pt'>
        <p>Dear ==> config
            <rs_property>user</rs_property>,</p>

        <p>Here are your scan results:</p> ===> config

        <table border=1 cellspacing=0 cellpadding=0 style='border-collapse:collapse;border:none'>

            <tr>
                <td width=200 valign=top style='width:147.15pt;border:solid windowtext 1.0pt;
  mso-border-alt:solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt'>
                    <p>File name</p>
                </td>
                <td width=118 valign=top style='width:88.8pt;border:solid windowtext 1.0pt;
  border-left:none;mso-border-left-alt:solid windowtext .5pt;mso-border-alt:
  solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt'>
                    <p>Scan outcome</p>
                </td>
                <td width=177 valign=top style='width:132.6pt;border:solid windowtext 1.0pt;
  border-left:none;mso-border-left-alt:solid windowtext .5pt;mso-border-alt:
  solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt'>
                    <p>File location</p>
                </td>
            </tr>
            <rs_table>
                <tr>
                    <td width=196 valign=top style='padding:0cm 5.4pt 0cm 5.4pt'>
                        <p>
                            <rs_property>file_name</rs_property>
                        </p>
                    </td>
                    <td width=196 valign=top style='padding:0cm 5.4pt 0cm 5.4pt'>
                        <p>
                            <rs_property>outcome</rs_property>
                        </p>
                    </td>
                    <td width=196 valign=top style='padding:0cm 5.4pt 0cm 5.4pt'>
                        <p>
                            <rs_condition>
                                <rs_property>is_successful</rs_property>
                                <rs_?>
                                    <a href='file://<rs_property>destination_store_path</rs_property>\<rs_property>file_relative_path</rs_property>'>
                                        <rs_property>destination_store_path</rs_property>\
                                        <rs_property>file_relative_path</rs_property>
                                    </a>
                                    <rs_:>N/A</rs_condition>
                        </p>
                    </td>
                </tr>
            </rs_table>
        </table>
        <p>Thank you for using ReSecure!</p>
    </body>

    </html>`


})


