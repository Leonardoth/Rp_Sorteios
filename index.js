// estrutura dos dados:
// var info = {'100-236':['100-236', '647-5839', 'Khilo Enil']}
// var numbers = {[1]:[],[2]:[],[3]:['100-236']}


var info = get_data('info') || {}
var numbers =  get_data('numbers') || new_numbers()
var entradas_sorteio = get_data('entries') || []


async function sort(){
    $('#sorteio_ganhador').removeClass('great_winner')
    $('#winner').removeClass('great_winner')
    await sorteio_effect()
}

function updateParticipants(){
    var entries = $('#texto').val()
    entries = ((entries.split('\n')).map( element => element.trim()))
    entries = entries.filter(element => element !== "")
    $('#sorteio_participantes').text(entries.length)
}

function calculateValue(){
    var quant = Number.parseInt($('#sorteio_participantes').text())
    var value = Number.parseInt($('#sorteio_entrada').val())
    $('#sorteio_lucro').text(quant * value)
    $('#sorteio_lucro').css('opacity', 1)
}
function random(array){
    return Math.floor(Math.random() * array.length)
}

function reset(){
    $('#sorteio_ganhador').removeClass('great_winner')
    $('#winner').removeClass('great_winner')
    $('#texto').val("")
    save_data('entries', [])
    entradas_sorteio = []
    updateParticipants()
    $('#sorteio_lucro').css('opacity', 0)
    $('#sorteado').removeClass('ativo')
    $('#winner').text("")
}

function show(e){
    hide_side()
    $('#sorteio').css('display', 'none')
    $('#rifa').css('display', 'none')
    $('#cadastro_rifa').css('display', 'none')
    load_data(e)
    $(`#${e}`).css('display', 'block')
}



function load_data(section){
    section == 'rifa'? load_rifa() : load_sorteio()
}

function load_rifa(){
    $('#rifa_winner1').hide()
    $('#rifa_winner2').hide()
    var div = $('#rifa_n')[0]
    div.innerHTML = ''
    var entries = Object.entries(numbers)
    for(const [numero, owner] of entries){
        var btn = document.createElement('button')
        btn.className = 'btn-number col-xm-1'
        var label = document.createElement('label')
        label.innerText = numero
        btn.appendChild(label)
        btn.addEventListener('click', function(){
            load_info(this)
        })
        if(owner.length > 0){
            btn.dataset.owner = owner
            btn.className += ' selected'
        }
        div.appendChild(btn)
        if(numero%10 === 0){
            var separator = document.createElement('div')
            separator.className ='col-12'
            div.appendChild(separator)
        }
    }
}

function load_sorteio(){
    $('#texto').val('')
    entradas_sorteio.forEach(entrada => {
        var val = $('#texto').val()
        $('#texto').val(val += `${entrada}\n`)
    })
    updateParticipants()
}

function get_data(data){
    return JSON.parse(localStorage.getItem(data))
}

function save_data(data, value){
    var item = JSON.stringify(value)
    localStorage.setItem(data, item)
}

function new_numbers(quant = 10){
    var numbers = {}
    for(i= 1; i <= quant; i++){
        numbers[i] = ''
    }

    save_data('numbers', numbers)
    return numbers
}

function load_info(element){
    var owner = element.dataset.owner || undefined
    var number = element.getElementsByTagName('label')[0].innerText
    $('.number_info').text(number)
    hide_side_instant()
    show_side()
    $('#rifa_n_info').fadeIn(1000)
    if(owner){
        var rifa_info = get_data('info') || {['100-236']: ['100-236', '647-5839', 'Khilo Enil']}
        $('.owner_id').text(owner)
        $('.owner_phone').text(rifa_info[owner][1])
        $('.owner_name').text(rifa_info[owner][2])
        $('#delete_number')[0].dataset.numero = number
        $('#delete_number')[0].disabled = false
    }else{
        $('.owner_id').text('-')
        $('.owner_phone').text('-')
        $('.owner_name').text('-')
        $('#delete_number')[0].disabled = true
    }
}

function delete_number(number){
    // receives number
    // removes the owner
    var rg = numbers[number]
    numbers[number] = ''
    //removes the number from the owners info.
    if(info[rg][3] == [number]){
        delete info[rg]
    }else{
        info[rg][3].splice(info[rg][3].indexOf(number), 1)
    }
    save_data('numbers', numbers)
    save_data('info', info)
    show('rifa')
}

function reset_rifa(){
    $('#rifa_n')[0].innerHTML = ''
    new_numbers($('#rifa_quantidade')[0].value)
    load_data('rifa')
}

function cadastrar(e){
    e.preventDefault()

    var rg = $('#cadastro_rg')[0].value
    var contato = $('#cadastro_contato')[0].value
    var nome = $('#cadastro_nome')[0].value
    var numeros = $('#cadastro_numeros')[0].value
    console.log(numeros.split(','))
    if(numeros.length > 0){
        
        if(info[rg]){
            numeros.split(',').forEach(numero =>{
                if(numbers[numero] == ''){
                    numbers[numero] = rg
                    info[rg][3].push(numero)
                }
            })
        }else{
            info[rg] = []
            info[rg][0] = rg
            info[rg][1] = contato
            info[rg][2] = nome || 'Não Fornecido.'
            info[rg][3] = [...numeros]
            numeros.split(',').forEach(numero =>{
                if(numbers[numero] == ''){
                    numbers[numero] = rg
                }
            })
        }
        
        
        save_data('numbers', numbers)
        save_data('info', info)
        show('rifa')
    }


}


function debug(){
    console.log('info',info)
    console.log('numbers', numbers)
    numbers = new_numbers(10)
    info = {}
    save_data('numbers', numbers)
    save_data('info', info)
}


function sortear(){
    rifa_effect()
}


function show_side(){   
    $('#left-side-back').fadeIn(1000)
    $("#left-side").animate({width:'show'}, 1000);
}

function hide_side(){
    hide_side_instant()
    $("#left-side").animate({width:'hide'}, 1000);
}

function cadastro(){
    $('#cadastro').children('input').each(function(){
        $(this).val('')
    })
    change_side('#cadastro_rifa')
}

function hide_side_content(){
    $('#left-side').children('div').each(function(){
        $(this).fadeOut(500)
    })
}

function hide_side_instant(){
    $('#left-side').children('div').each(function(){
        $(this).hide()
    })
}

function new_raffle(){
    change_side('#nova_rifa')
}

function change_side(new_content){
    // Changes the content of the sidebar without having to close it.
    $('#nova_rifa').hide()
    $('#cadastro_rifa').hide()
    $('#rifa_n_info').hide()
    $(new_content).fadeIn(2000)
    show_side()
}

function saveTexto(){
    var entries = $('#texto').val()
    entries = ((entries.split('\n')).map( element => element.trim()))
    entries = entries.filter(element => element !== "")
    save_data('entries', entries)
    entradas_sorteio = entries
    updateParticipants()
}


async function sorteio_effect(){
    // Aparecer bem rápido os participantes do sorteio, aleatoriamente
    // Ao decidir o vencedor, dará uma classe diferenciada pros labels. Showtime.
    if(entradas_sorteio.length <= 1) return
    var j = Math.max(entradas_sorteio.length, 20)
    for (let index = 0; index < j; index++) {
        var element = entradas_sorteio[random(entradas_sorteio)]
        await sleep(100)
        $('#winner').text(element)
    }
    $('#sorteio_ganhador').addClass('great_winner')
    $('#winner').addClass('great_winner')
    $('#winner').text(entradas_sorteio[random(entradas_sorteio)])
}

async function rifa_effect(){
    $('#rifa_winner1').hide()
    $('#rifa_winner2').hide()
    var max = $('.btn-number').length
    var repeats = Math.max(max, 20)
    var resultado
    for (let index = 0; index < repeats; index++) {
        $('.number_cursor').removeClass('number_cursor')
        var r = Math.floor(Math.random() * max)
        console.log('R=', r)
        $($('.btn-number')[r]).addClass('number_cursor')
        resultado = r+1
        await sleep(100)
    }
    
    $('#rifa_winner1').show()
    $('#rifa_winner2').show()
    $('#rifa_winner2').text(resultado)
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function import_show(){
    $('#import_hidden').show()
    $('#import_button').hide()
}

function import_hide(){
    $('#import_button').show()
    $("#import_text").val('')
    $('#import_hidden').hide()
}

function json_imported(){
    var data
    try{
        data = JSON.parse($('#import_text').val())
    }catch(err){
        return import_hide()
    }
    if(data.numbers !== undefined){
        new_numbers(Object.keys(data.numbers).length)
        save_data('numbers', data.numbers)
        var info = convert_participants(data.participants)
        save_data('info', info)
    }

    import_hide()
}

function convert_participants(object){
    var information = {}
    Object.keys(object).forEach(key =>{
        var participant = object[key]
        information[key] = [participant.rg, participant.contato, participant.nome, participant.numeros]
    })

    return information
}