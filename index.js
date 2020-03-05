// estrutura dos dados:
// var info = {'100-236':['100-236', '647-5839', 'Khilo Enil']}
// var numbers = {[1]:[],[2]:[],[3]:['100-236']}


var info = get_data('info') || {}
var numbers =  get_data('numbers') || new_numbers()


function sort(){
    var entries = $('#texto').val()
    entries = ((entries.split('\n')).map( element => element.trim()))
    entries = entries.filter(element => element !== "")
    var resultado = entries[random(entries)]
    
    $('#sorteado').addClass('ativo')
    $('#winner').text(resultado)
}


function random(array){
    return Math.floor(Math.random() * array.length)
}

function reset(){
    $('#texto').val("")
    $('#sorteado').removeClass('ativo')
    $('#winner').text("")
}

function show(e){
    $('#sorteio').css('display', 'none')
    $('#rifa').css('display', 'none')
    $('#cadastro_rifa').css('display', 'none')
    $('#nova_rifa').css('display', 'none')
    load_data(e)
    $(`#${e}`).css('display', 'block')
}

function number_info(element){

}

function load_data(section){
    section == 'rifa'? load_rifa() : load_sorteio()
}

function load_rifa(){
    var div = $('#rifa_n')[0]
    div.innerHTML = ''
    var temp = document.getElementsByTagName('template')[0]
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
    numbers[number] = ''
    // removes the number from the owners info.
    delete info[number]
    save_data('numbers', numbers)
    save_data('info', info)
}

function reset_rifa(){
    var numbers = $('#rifa_n')[0].innerHTML = ''
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
                console.log(numero)
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
    // choose random number (min, max)
    var min = 1
    var max = $('.btn-number').length
    var resultado = Math.floor(Math.random() * max) + 1
    // Shows winner
    $('#rifa_winner1').show()
    $('#rifa_winner2').show()
    $('#rifa_winner2').text(resultado)
}